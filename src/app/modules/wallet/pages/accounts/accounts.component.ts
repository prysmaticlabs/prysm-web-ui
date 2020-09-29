import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { BigNumber } from 'ethers';
import { BehaviorSubject, Observable, throwError, zip } from 'rxjs';
import { catchError, debounceTime, map, share, switchMap, tap } from 'rxjs/operators';
import { zipMap } from 'rxjs-pipe-ext/lib';

import { base64ToHex } from 'src/app/modules/core/utils/hex-util';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { WalletService } from '../../../core/services/wallet.service';
import { GWEI_PER_ETHER } from 'src/app/modules/core/constants';
import { ValidatorBalances, Validators } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { ListAccountsResponse } from 'src/app/proto/validator/accounts/v2/web_api';
import { TableData } from '../../components/accounts-table/accounts-table.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
})
export class AccountsComponent {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | null = null;

  constructor(
    private walletService: WalletService,
    private validatorService: ValidatorService,
  ) { }

  pageSizes: number[] = [5, 10, 50, 100, 250];
  totalData = 0;
  loading = false;

  // Observables.
  private pageChanged$ = new BehaviorSubject<PageEvent>({
    pageIndex: 0,
    pageSize: this.pageSizes[0],
  } as PageEvent);
  selection = new SelectionModel<TableData>(true /* allow multiselect */, []);
  tableDataSource$: Observable<MatTableDataSource<TableData>> = this.pageChanged$.pipe(
    // Debounce to prevent spamming the paginator component.
    tap(() => this.loading = true),
    debounceTime(300),
    switchMap((ev: PageEvent) => this.walletService.accounts$.pipe(
      // Extract the validating public keys.
      zipMap(accs => accs.accounts?.map(account => account.validatingPublicKey)),
      switchMap(([accountsResponse, pubKeys]) =>
        // Combine the list of validators and their balances to display in the table.
        zip(
          this.validatorService.validatorList(pubKeys, ev.pageIndex, ev.pageSize),
          this.validatorService.balances(pubKeys, ev.pageIndex, ev.pageSize)
        ).pipe(
          map(([validators, balances]) =>
            // Transform the data into a pretty format for our table.
            this.transformTableData(accountsResponse, validators, balances)
          ),
        )
      ),
    )),
    share(), // Share the observable across all subscribers.
    tap(() => this.loading = false),
    catchError(err => {
      this.loading = false;
      return throwError(err);
    }),
  );

  applySearchFilter(event: Event, dataSource: MatTableDataSource<TableData>): void {
    const filterValue = (event.target as HTMLInputElement).value;
    if (dataSource) {
      dataSource.filter = filterValue.trim().toLowerCase();
      dataSource.paginator?.firstPage();
    }
  }

  // Event handles.
  handlePageEvent(event: PageEvent): void {
    this.pageChanged$.next(event);
  }

  private transformTableData(
    accountsResponse: ListAccountsResponse,
    validators: Validators,
    balances: ValidatorBalances
  ): MatTableDataSource<TableData> {
    if (validators.totalSize !== balances.totalSize) {
      throw new Error('Mismatched total page size for validators and balances responses');
    }
    this.totalData = validators.totalSize;
    const tableData = validators.validatorList.map((val, idx) => {
      const accName = accountsResponse.accounts.find(
        acc => acc.validatingPublicKey === val?.validator?.publicKey
      );
      const balance = BigNumber.from(balances?.balances[idx].balance).toNumber() / GWEI_PER_ETHER;
      const effectiveBalance = BigNumber.from(val?.validator?.effectiveBalance).toNumber() / GWEI_PER_ETHER;
      return {
        select: idx,
        accountName: accName?.accountName,
        index: val?.index,
        publicKey: val?.validator?.publicKey,
        balance,
        effectiveBalance,
        status: 'active',
        activationEpoch: val?.validator?.activationEpoch,
        exitEpoch: val?.validator?.exitEpoch,
        lowBalance: balance < 32,
        options: val?.validator?.publicKey,
      } as TableData;
    });
    const dataSource = new MatTableDataSource(tableData);
    dataSource.filterPredicate = this.filterPredicate;
    return dataSource;
  }

  private filterPredicate(el: TableData, filter: string): boolean {
    const inAccountName = el.accountName.indexOf(filter) !== -1;
    const inPublicKey = base64ToHex(el.publicKey).indexOf(filter) !== -1;
    const inValidatorIndex = el.index.toString() === filter;
    return inAccountName || inPublicKey || inValidatorIndex;
  }
}
