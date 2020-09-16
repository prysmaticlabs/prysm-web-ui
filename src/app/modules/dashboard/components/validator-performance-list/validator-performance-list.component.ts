import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { BigNumber } from 'ethers';
import { ValidatorPerformanceResponse } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { throwError } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { ValidatorService } from '../../../core/services/validator.service';

export interface ValidatorListItem {
  publicKey: string;
  currentEffectiveBalances: string;
  inclusionSlots: string;
  inclusionDistances: string;
  correctlyVotedSource: boolean;
  correctlyVotedTarget: boolean;
  correctlyVotedHead: boolean;
  balancesBeforeEpochTransition: string;
  balancesAfterEpochTransition: string;
  gains: string;
}

@Component({
  selector: 'app-validator-performance-list',
  templateUrl: './validator-performance-list.component.html',
})
export class ValidatorPerformanceListComponent {
  displayedColumns: string[] = [
    'publicKey',
    'attLastIncludedSlot',
    'correctlyVotedSource',
    'correctlyVotedTarget',
    'correctlyVotedHead',
    'gains'
  ];
  dataSource?: MatTableDataSource<ValidatorListItem>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | null = null;
  @ViewChild(MatSort, { static: true }) sort: MatSort | null = null;

  loading = true;
  hasError = false;
  noData = false;

  constructor(private validatorService: ValidatorService) {

    this.validatorService.performance$.pipe(
      map((performance: ValidatorPerformanceResponse) => {
        const list: ValidatorListItem[] = [];
        if (performance) {
          for (let i = 0; i < performance.publicKeys.length; i++) {
            const item = {} as ValidatorListItem;
            item.publicKey = performance.publicKeys[i];
            item.correctlyVotedSource = performance.correctlyVotedSource[i];
            item.correctlyVotedHead = performance.correctlyVotedHead[i];
            item.correctlyVotedTarget = performance.correctlyVotedTarget[i];
            item.balancesAfterEpochTransition = performance.balancesAfterEpochTransition[i] || '0';
            item.balancesBeforeEpochTransition = performance.balancesBeforeEpochTransition[i] || '0';
            item.currentEffectiveBalances = performance.currentEffectiveBalances[i] || '0';
            item.inclusionDistances = performance.inclusionDistances[i];
            item.inclusionSlots = performance.inclusionSlots[i];
            item.gains = BigNumber.from(item.balancesAfterEpochTransition).sub(
              BigNumber.from(item.balancesBeforeEpochTransition)).toString();
            list.push(item);
          }
        }
        return list;
      }),
      tap(result => {
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
        this.noData = result.length === 0;
      }),
      catchError(err => {
        this.loading = false;
        this.hasError = true;
        return throwError(err);
      }),
      take(1)
    ).subscribe();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.dataSource.paginator?.firstPage();
    }
  }
}
