import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { take, tap } from 'rxjs/operators';
import { WalletService } from '../../../core/services/wallet.service';
import {
  ListAccountsResponse,
  Account,
} from 'src/app/proto/validator/accounts/v2/web_api';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
})
export class AccountListComponent implements OnInit {
  displayedColumns: string[] = ['accountName', 'validatingPublicKey'];
  dataSource: MatTableDataSource<Account> | null = null;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | null = null;
  @ViewChild(MatSort, {static: true}) sort: MatSort | null = null;

  constructor(private walletService: WalletService) {
  }

  ngOnInit(): void {
    this.walletService.accounts$.pipe(
      tap((result: ListAccountsResponse) => {
        this.dataSource = new MatTableDataSource(result?.accounts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
