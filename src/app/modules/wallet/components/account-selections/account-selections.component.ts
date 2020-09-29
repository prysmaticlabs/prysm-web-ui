import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TableData } from '../accounts-table/accounts-table.component';
import { BackupSelectedAccountsComponent } from '../backup-selected-accounts/backup-selected-accounts.component';
import { DeleteSelectedAccountsComponent } from '../delete-selected-accounts/delete-selected-accounts.component';

@Component({
  selector: 'app-account-selections',
  templateUrl: './account-selections.component.html',
})
export class AccountSelectionsComponent {
  @Input() selection: SelectionModel<TableData> | null = null;
  constructor(
    private dialog: MatDialog,
  ) { }

  openBackupDialog(): void {
    this.dialog.open(BackupSelectedAccountsComponent, {
      data: this.selection?.selected.map((d: TableData) => d.publicKey),
      width: '600px',
    });
  }

  openDeleteDialog(): void {
    this.dialog.open(DeleteSelectedAccountsComponent, {
      data: this.selection?.selected.map((d: TableData) => d.publicKey),
      width: '600px',
    });
  }
}
