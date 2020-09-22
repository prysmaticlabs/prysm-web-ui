import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { WalletService } from '../../../core/services/wallet.service';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { zip } from 'rxjs';
import { zipMap } from 'rxjs-pipe-ext/lib';

interface TableData {
  accountName: string;
  index: number;
  publicKey: string;
  balance: string;
  effectiveBalance: string;
  status: string;
  activationEpoch: number;
  exitEpoch: number;
}

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
})
export class AccountListComponent implements OnInit {
  displayedColumns: string[] = [
    'accountName',
    'publicKey',
    'index',
    'balance',
    'effectiveBalance',
    'status',
    'activationEpoch',
    'exitEpoch',
  ];
  dataSource: MatTableDataSource<TableData> | null = null;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | null = null;
  @ViewChild(MatSort, {static: true}) sort: MatSort | null = null;

  constructor(
    private walletService: WalletService,
    private validatorService: ValidatorService,
  ) { }

  ngOnInit(): void {
    this.walletService.accounts$.pipe(
      zipMap(accs => accs.accounts?.map(account => account.validatingPublicKey)),
      switchMap(([accountsResponse, pubKeys]) =>
        zip(
          this.validatorService.validatorList(pubKeys),
          this.validatorService.balances(pubKeys)
        ).pipe(
          map(([validators, balances]) => {
            return validators.validatorList.map((val, idx) => {
              const accName = accountsResponse.accounts.find(
                acc => acc.validatingPublicKey === val?.validator?.publicKey
              );
              return {
                accountName: accName?.accountName,
                index: val?.index,
                publicKey: val?.validator?.publicKey,
                balance: balances?.balances[idx].balance,
                effectiveBalance: val?.validator?.effectiveBalance,
                status: 'active',
                activationEpoch: val?.validator?.activationEpoch,
                exitEpoch: val?.validator?.exitEpoch,
              } as TableData;
            });
          }),
          tap((data: TableData[]) => {
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }),
        )
      ),
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
