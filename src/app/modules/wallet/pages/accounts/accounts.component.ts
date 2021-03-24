import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { BigNumber } from 'ethers';
import { BehaviorSubject, Observable, throwError, zip } from 'rxjs';
import {
  catchError,
  debounceTime,
  map,
  share,
  switchMap,
  tap,
} from 'rxjs/operators';
import { zipMap } from 'rxjs-pipe-ext/lib';

import { base64ToHex } from 'src/app/modules/core/utils/hex-util';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { WalletService } from '../../../core/services/wallet.service';
import {
  FAR_FUTURE_EPOCH,
  GWEI_PER_ETHER,
} from 'src/app/modules/core/constants';
import {
  ValidatorBalances,
  Validators,
  Validators_ValidatorContainer,
} from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { Validator } from 'src/app/proto/eth/v1alpha1/validator';
import { ListAccountsResponse } from 'src/app/proto/validator/accounts/v2/web_api';
import { TableData } from '../../components/accounts-table/accounts-table.component';
import { formatUnits } from 'ethers/lib/utils';
import { Router } from '@angular/router';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { BaseComponent } from '../../../shared/components/base.component';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
})
export class AccountsComponent extends BaseComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator | null = null;

  constructor(
    private walletService: WalletService,
    private userService: UserService,
    private validatorService: ValidatorService
  ) {
    super();
  }

  pageSizes: number[] = [5, 10, 50, 100, 250];
  totalData = 0;
  loading = false;
  pageSize = 5;

  // Observables.
  private pageChanged$ = new BehaviorSubject<PageEvent>({
    pageIndex: 0,
    pageSize: this.pageSizes[0],
  } as PageEvent);
  selection = new SelectionModel<TableData>(true /* allow multiselect */, []);
  tableDataSource$: Observable<
    MatTableDataSource<TableData>
  > = this.pageChanged$.pipe(
    // Debounce to prevent spamming the paginator component.
    tap(() => (this.loading = true)),
    debounceTime(300),
    switchMap((ev: PageEvent) => {
      return this.walletService.accounts(ev.pageIndex, ev.pageSize).pipe(
        // Extract the validating public keys.
        zipMap((accs) =>
          accs.accounts?.map((account) => account.validatingPublicKey)
        ),
        switchMap(([accountsResponse, pubKeys]) =>
          // Combine the list of validators and their balances to display in the table.
          zip(
            this.validatorService.validatorList(pubKeys, 0, pubKeys.length),
            this.validatorService.balances(pubKeys, 0, pubKeys.length)
          ).pipe(
            map(([validators, balances]) =>
              // Transform the data into a pretty format for our table.
              this.transformTableData(accountsResponse, validators, balances)
            )
          )
        )
      );
    }),
    share(), // Share the observable across all subscribers.
    tap(() => (this.loading = false)),
    catchError((err) => {
      return throwError(err);
    })
  );
  ngOnInit(): void {
    this.userService.user$
      .pipe(
        filter((x) => !!x),
        takeUntil(this.destroyed$),
        tap((x) => {
          this.pageSize = x.acountsPerPage;
          this.pageSizes = x.pageSizeOptions;
          console.log(x.acountsPerPage);
        })
      )
      .subscribe();
  }
  applySearchFilter(
    event: Event,
    dataSource: MatTableDataSource<TableData>
  ): void {
    const filterValue = (event.target as HTMLInputElement).value;
    if (dataSource) {
      dataSource.filter = filterValue.trim().toLowerCase();
      dataSource.paginator?.firstPage();
    }
  }

  // Event handles.
  handlePageEvent(event: PageEvent): void {
    this.userService.changeAccountListPerPage(event.pageSize);
    this.pageChanged$.next(event);
  }

  private transformTableData(
    accountsResponse: ListAccountsResponse,
    validators: Validators,
    balances: ValidatorBalances
  ): MatTableDataSource<TableData> {
    this.totalData = accountsResponse.totalSize;
    const tableData = accountsResponse.accounts.map((acc, idx) => {
      let val = validators?.validatorList?.find(
        (v) => acc.validatingPublicKey === v?.validator?.publicKey
      );
      if (!val) {
        val = {
          index: 0,
          validator: {
            effectiveBalance: '0',
            activationEpoch: FAR_FUTURE_EPOCH,
            exitEpoch: FAR_FUTURE_EPOCH,
          } as Validator,
        } as Validators_ValidatorContainer;
      }
      const balanceItem = balances?.balances.find(
        (b) => b.publicKey === acc.validatingPublicKey
      );
      let bal = '0';
      let status = 'unknown';
      if (balanceItem && balanceItem.status) {
        status =
          balanceItem.status !== ''
            ? balanceItem.status.toLowerCase()
            : 'unknown';
        bal = formatUnits(BigNumber.from(balanceItem.balance), 'gwei');
      }
      const effectiveBalance = BigNumber.from(
        val?.validator?.effectiveBalance
      ).div(GWEI_PER_ETHER);
      return {
        select: idx,
        accountName: acc?.accountName,
        index: val?.index ? val.index : 'n/a',
        publicKey: acc.validatingPublicKey,
        balance: bal,
        effectiveBalance: effectiveBalance.toString(),
        status,
        activationEpoch: val?.validator?.activationEpoch,
        exitEpoch: val?.validator?.exitEpoch,
        lowBalance: effectiveBalance.toNumber() < 32,
        options: acc.validatingPublicKey,
      } as TableData;
    });
    const dataSource = new MatTableDataSource(tableData);
    dataSource.filterPredicate = this.filterPredicate;
    return dataSource;
  }

  private filterPredicate(el: TableData, f: string): boolean {
    const inAccountName = el.accountName.indexOf(f) !== -1;
    const inPublicKey = base64ToHex(el.publicKey).indexOf(f) !== -1;
    const inValidatorIndex = el.index.toString() === f;
    return inAccountName || inPublicKey || inValidatorIndex;
  }
}
