import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { hexlify } from 'ethers/lib/utils';
import { map, take, tap } from 'rxjs/operators';
import { ValidatorService } from '../../../core/services/validator.service';

export class ValidatorListItem {
  publicKey: string;
  currentEffectiveBalances: number;
  inclusionSlots: number;
  inclusionDistances: number;
  correctlyVotedSource: boolean;
  correctlyVotedTarget: boolean;
  correctlyVotedHead: boolean;
  balancesBeforeEpochTransition: number;
  balancesAfterEpochTransition: number;
  gains: number;
}

@Component({
  selector: 'app-validator-performance-list',
  templateUrl: './validator-performance-list.component.html',
})
export class ValidatorPerformanceListComponent {
  displayedColumns: string[] = ['publicKey', 'attLastIncludedSlot', 'correctlyVotedSource', 'correctlyVotedTarget', 'correctlyVotedHead', 'gains'];
  dataSource: MatTableDataSource<ValidatorListItem>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private validatorService: ValidatorService) {

    this.validatorService.performance$.pipe(
      map(perforamance => {
        let list: ValidatorListItem[] = [];
        if (perforamance) {
        for(let i = 0; i < perforamance.publicKeys.length; i++)
        {
          let item = new ValidatorListItem();
          item.publicKey = hexlify(perforamance.publicKeys[i]);
          item.correctlyVotedSource = perforamance.correctlyVotedSource[i];
          item.correctlyVotedHead = perforamance.correctlyVotedHead[i];
          item.correctlyVotedTarget = perforamance.correctlyVotedTarget[i];
          item.balancesAfterEpochTransition = perforamance.balancesAfterEpochTransition[i] || 0;
          item.balancesBeforeEpochTransition = perforamance.balancesBeforeEpochTransition[i] || 0;
          item.currentEffectiveBalances = perforamance.currentEffectiveBalances[i] || 0;
          item.inclusionDistances = perforamance.inclusionDistances[i];
          item.inclusionSlots = perforamance.inclusionSlots[i];
          item.gains = item.balancesAfterEpochTransition - item.balancesBeforeEpochTransition;
          list.push(item);
          }
        }
        return list;
      }),
      tap(result => {
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }),
      take(1)
    ).subscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
