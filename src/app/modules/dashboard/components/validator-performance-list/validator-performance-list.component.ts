import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { BigNumber } from 'ethers';
import { ValidatorSummaryResponse } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { EMPTY, forkJoin, Observable, throwError, zip } from 'rxjs';
import { catchError, map, take, tap, takeUntil, filter, switchMap, flatMap, concatMap, mergeMap } from 'rxjs/operators';
import { ValidatorService } from '../../../core/services/validator.service';
import { BaseComponent } from '../../../shared/components/base.component';
import { UserService } from '../../../shared/services/user.service';
import { ListFeeRecipientResponse } from 'src/app/proto/validator/accounts/v2/web_api_keymanager-api';
import { base64ToHex } from 'src/app/modules/core/utils/hex-util';

export interface ValidatorListItem {
  publicKey: string;
  feeRecipient: string;
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
    'feeRecipient',
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
            for (let i = 0; i < performance.public_keys.length; i++) {
              // converting snake_case to camelCase
              const item = {} as ValidatorListItem;
              item.publicKey = performance.public_keys[i];
              item.correctlyVotedSource = performance.correctly_voted_source[i];
              item.correctlyVotedHead = performance.correctly_voted_head[i];
              item.correctlyVotedTarget = performance.correctly_voted_target[i];
              item.balancesAfterEpochTransition =
                performance.balances_after_epoch_transition[i] || '0';
              item.balancesBeforeEpochTransition =
                performance.balances_before_epoch_transition[i] || '0';
              item.currentEffectiveBalances =
                performance.current_effective_balances[i] || '0';
              item.gains = BigNumber.from(item.balancesAfterEpochTransition)
                .sub(BigNumber.from(item.balancesBeforeEpochTransition))
                .toString();
              list.push(item);
            }
          }
          return list;
        }),
        switchMap((list:ValidatorListItem[]) => {
          const arrayOfRequests: Observable<ListFeeRecipientResponse>[] = [];
          list.forEach((item:ValidatorListItem)=>{
            arrayOfRequests.push(this.validatorService.getFeeRecipient(item.publicKey));
          });
          return forkJoin(arrayOfRequests).pipe(
            map((res:ListFeeRecipientResponse[]) => {
              res.forEach((r)=>{
                let item = list.find((obj)=>base64ToHex(obj.publicKey) === r.data.pubkey)
                if(item){
                  item.feeRecipient = r.data.ethAddress
                }
              })
              return list;
            })
          )
        }),
        tap((list:ValidatorListItem[])=>{
          this.dataSource = new MatTableDataSource(list);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.loading = false;
          this.noData = list.length === 0;
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
function compactMap(arg0: (res: ListFeeRecipientResponse[]) => void): import("rxjs").OperatorFunction<ListFeeRecipientResponse[], unknown> {
  throw new Error('Function not implemented.');
}

