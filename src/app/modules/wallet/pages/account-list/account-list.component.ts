import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { BigNumber } from 'ethers';
import { Subject, zip } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { zipMap } from 'rxjs-pipe-ext/lib';

import { base64ToHex } from 'src/app/modules/core/utils/hex-util';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { WalletService } from '../../../core/services/wallet.service';
import { OptionGroup } from '../../components/icon-trigger-select/icon-trigger-select.component';
import { GWEI_PER_ETHER } from 'src/app/modules/core/constants';
import { ValidatorBalances, Validators } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { ListAccountsResponse } from 'src/app/proto/validator/accounts/v2/web_api';

interface TableData {
  select: number;
  accountName: string;
  index: number;
  publicKey: string;
  balance: number;
  effectiveBalance: number;
  status: string;
  activationEpoch: number;
  exitEpoch: number;
  lowBalance: boolean;
  options: string;
}

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
})
export class AccountListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | null = null;
  @ViewChild(MatSort, {static: true}) sort: MatSort | null = null;

  constructor(
    private walletService: WalletService,
    private validatorService: ValidatorService,
  ) { }

  displayedColumns: string[] = [
    'select',
    'accountName',
    'publicKey',
    'index',
    'balance',
    'effectiveBalance',
    'activationEpoch',
    'exitEpoch',
    'status',
    'options',
  ];
  dataSource: MatTableDataSource<TableData> | null = null;
  selection: SelectionModel<number> | null = null;
  optionGroups: OptionGroup[] = [
    {
      name: 'Details',
      options: [
        {value: 'view-beaconchain', viewValue: 'View in Explorer'},
        {value: 'deposit-data', viewValue: 'View Deposit Data'},
      ]
    },
    {
      name: 'Danger Zone',
      options: [
        {value: 'backup', viewValue: 'Backup Account'},
        {value: 'delete', viewValue: 'Delete Account', danger: true},
      ]
    },
  ];

  private destroyed$$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeSelections();
    this.initializeAccounts();
  }

  ngOnDestroy(): void {
    this.destroyed$$.next();
    this.destroyed$$.complete();
  }

  isAllSelected(): boolean {
    const numSelected = this.selection?.selected.length;
    const numRows = this.dataSource?.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ?
        this.selection?.clear() :
        this.dataSource?.data.forEach(row => this.selection?.select(row.select));
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.dataSource.paginator?.firstPage();
    }
  }

  formatStatusColor(validatorStatus: string): string {
    switch (validatorStatus.trim().toLowerCase()) {
      case 'active':
        return 'primary';
      case 'pending':
        return 'accent';
      case 'exited':
        return 'warn';
      case 'slashed':
        return 'warn';
      default:
        return '';
    }
  }

  private initializeSelections(): void {
    const initialSelection: any[] = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<number>(allowMultiSelect, initialSelection);
  }

  private initializeAccounts(): void {
    this.walletService.accounts$.pipe(
      zipMap(accs => accs.accounts?.map(account => account.validatingPublicKey)),
      switchMap(([accountsResponse, pubKeys]) =>
        zip(
          this.validatorService.validatorList(pubKeys),
          this.validatorService.balances(pubKeys)
        ).pipe(
          map(([validators, balances]) =>
            this.transformTableData(accountsResponse, validators, balances)
          ),
          tap(this.initializeDataSource.bind(this)),
        )
      ),
      takeUntil(this.destroyed$$),
    ).subscribe();
  }


  private transformTableData(
    accountsResponse: ListAccountsResponse,
    validators: Validators,
    balances: ValidatorBalances
  ): TableData[] {
    return validators.validatorList.map((val, idx) => {
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
  }

  private initializeDataSource(data: TableData[]): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.searchFields;
  }

  private searchFields(el: TableData, filter: string): boolean {
    const inAccountName = el.accountName.indexOf(filter) !== -1;
    const inPublicKey = base64ToHex(el.publicKey).indexOf(filter) !== -1;
    const inValidatorIndex = el.index.toString() === filter;
    return inAccountName || inPublicKey || inValidatorIndex;
  }
}
