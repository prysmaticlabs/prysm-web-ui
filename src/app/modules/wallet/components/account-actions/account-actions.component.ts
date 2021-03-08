import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input } from '@angular/core';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { TableData } from '../accounts-table/accounts-table.component';
import { MatDialog } from '@angular/material/dialog';
import { AccountDeleteComponent } from '../../pages/account-delete/account-delete.component';
import { base64ToHex } from '../../../core/utils/hex-util';

@Component({
  selector: 'app-account-actions',
  templateUrl: './account-actions.component.html',
  styles: [],
})
export class AccountActionsComponent {
  constructor(
    private walletService: WalletService,
    private dialog: MatDialog
  ) {}

  @Input() selection: SelectionModel<TableData> | null = null;
  walletConfig$ = this.walletService.walletConfig$;

  get publicKeys(): string[] {
    if (!this.selection || this.selection.selected.length === 0) {
      return [];
    }
    return this.selection.selected.map((x) =>
      base64ToHex(x.publicKey).slice(0, 16)
    );
  }

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
