import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { BigNumber } from 'ethers';
import { ValidatorSummaryResponse } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { throwError } from 'rxjs';
import { catchError, map, take, tap, takeUntil, filter } from 'rxjs/operators';
import { ValidatorService } from '../../../core/services/validator.service';
import { BaseComponent } from '../../../shared/components/base.component';
import { UserService } from '../../../shared/services/user.service';

export interface ValidatorListItem {
  publicKey: string;
  currentEffectiveBalances: string;
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
export class ValidatorPerformanceListComponent
  extends BaseComponent
  implements OnInit {
  displayedColumns: string[] = [
    'publicKey',
    'correctlyVotedSource',
    'correctlyVotedTarget',
    'correctlyVotedHead',
    'gains',
  ];
  dataSource?: MatTableDataSource<ValidatorListItem>;

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator | null = null;
  @ViewChild(MatSort, { static: true }) sort: MatSort | null = null;

  loading = true;
  hasError = false;
  noData = false;
  pageSizeOptions: number[] = [];
  pageSize = 5;
  constructor(
    private validatorService: ValidatorService,
    private userService: UserService
  ) {
    super();
    this.validatorService.performance$
      .pipe(
        map((performance: ValidatorSummaryResponse) => {
          const list: ValidatorListItem[] = [];
          if (performance) {
            for (let i = 0; i < performance.publicKeys.length; i++) {
              const item = {} as ValidatorListItem;
              item.publicKey = performance.publicKeys[i];
              item.correctlyVotedSource = performance.correctlyVotedSource[i];
              item.correctlyVotedHead = performance.correctlyVotedHead[i];
              item.correctlyVotedTarget = performance.correctlyVotedTarget[i];
              item.balancesAfterEpochTransition =
                performance.balancesAfterEpochTransition[i] || '0';
              item.balancesBeforeEpochTransition =
                performance.balancesBeforeEpochTransition[i] || '0';
              item.currentEffectiveBalances =
                performance.currentEffectiveBalances[i] || '0';
              item.gains = BigNumber.from(item.balancesAfterEpochTransition)
                .sub(BigNumber.from(item.balancesBeforeEpochTransition))
                .toString();
              list.push(item);
            }
          }
          return list;
        }),
        tap((result) => {
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.loading = false;
          this.noData = result.length === 0;
        }),
        catchError((err) => {
          this.loading = false;
          this.hasError = true;
          return throwError(err);
        }),
        take(1)
      )
      .subscribe();
  }
  ngOnInit(): void {
    this.userService.user$
      .pipe(
        takeUntil(this.destroyed$),
        filter((x) => !!x),
        tap((x) => {
          this.pageSizeOptions = x.pageSizeOptions;
          this.pageSize = x.gainAndLosesPageSize;
        })
      )
      .subscribe();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.dataSource.paginator?.firstPage();
    }
  }

  pageChange(ev: PageEvent): void {
    this.userService.changeGainsAndLosesPageSize(ev.pageSize);
  }
}
