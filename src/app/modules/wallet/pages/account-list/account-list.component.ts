import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { WalletService } from '../../../core/services/wallet.service';
import {
  Validators, Validators_ValidatorContainer,
} from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
})
export class AccountListComponent implements OnInit {
  displayedColumns: string[] = [
    'publicKey',
    'effectiveBalance',
    'activationEpoch',
    'slashed',
  ];
  dataSource: MatTableDataSource<Validators_ValidatorContainer> | null = null;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | null = null;
  @ViewChild(MatSort, {static: true}) sort: MatSort | null = null;

  constructor(
    private walletService: WalletService,
    private validatorService: ValidatorService,
  ) {
  }

  ngOnInit(): void {
    this.walletService.accounts$.pipe(
      map(accs => accs.accounts?.map(account => account.validatingPublicKey)),
      switchMap((pubKeys: string[]) =>
        this.validatorService.listValidators(pubKeys).pipe(
          tap((result: Validators) => {
            this.dataSource = new MatTableDataSource(result.validatorList);
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
