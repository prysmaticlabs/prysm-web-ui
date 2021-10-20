import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { TableData } from '../accounts-table/accounts-table.component';
import { AccountDeleteComponent } from '../account-delete/account-delete.component';
import { LANDING_URL } from 'src/app/modules/core/constants';



@Component({
  selector: 'app-account-actions',
  templateUrl: './account-actions.component.html',
  styles: [],
})
export class AccountActionsComponent {

  readonly LANDING_URL = '/'+LANDING_URL;

  constructor(
    private walletService: WalletService,
    private dialog: MatDialog
  ) {}
  walletConfig$ = this.walletService.walletConfig$;
  @Input() selection: SelectionModel<TableData> | null = null;
  openDelete(): void {
    if (!this.selection) {
      return;
    }
    const keys = this.selection.selected.map((x) => x.publicKey);
    this.dialog.open(AccountDeleteComponent, {
      width: '600px',
      data: keys,
    });
  }
}
