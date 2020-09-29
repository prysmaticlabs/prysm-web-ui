import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BEACONCHAIN_EXPLORER, DIALOG_WIDTH } from 'src/app/modules/core/constants';
import { base64ToHex } from 'src/app/modules/core/utils/hex-util';
import { BackupSelectedAccountsComponent } from '../backup-selected-accounts/backup-selected-accounts.component';
import { DeleteSelectedAccountsComponent } from '../delete-selected-accounts/delete-selected-accounts.component';

import { MenuItem } from '../icon-trigger-select/icon-trigger-select.component';

export interface TableData {
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
  selector: 'app-accounts-table',
  templateUrl: './accounts-table.component.html',
})
export class AccountsTableComponent implements AfterViewInit {
  @Input() dataSource: MatTableDataSource<TableData> | null = null;
  @Input() selection: SelectionModel<TableData> | null = null;
  @ViewChild(MatSort, {static: true}) sort: MatSort | null = null;
  constructor(
    private dialog: MatDialog,
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
  menuItems: MenuItem[] = [
    {
      name: 'View On Beaconcha.in Explorer',
      icon: 'open_in_new',
      action: this.openExplorer.bind(this),
    },
    {
      name: 'Backup Account',
      icon: 'get_app',
      action: this.openBackupDialog.bind(this),
    },
    {
      name: 'Delete Account',
      icon: 'delete',
      danger: true,
      action: this.openDeleteDialog.bind(this),
    },
  ];

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  masterToggle(): void {
    if (this.dataSource && this.selection) {
      const sel = this.selection;
      this.isAllSelected() ?
        sel.clear() :
        this.dataSource.data.forEach(row => sel.select(row));
    }
  }

  isAllSelected(): boolean {
    if (this.selection && this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
    return false;
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

  private openExplorer(publicKey: string): void {
    if (window !== undefined) {
      let hex = base64ToHex(publicKey);
      hex = hex.replace('0x', '');
      window.open(`${BEACONCHAIN_EXPLORER}/validator/${hex}`, '_blank');
    }
  }

  private openBackupDialog(publicKey: string): void {
    this.dialog.open(BackupSelectedAccountsComponent, {
      data: [publicKey],
      width: DIALOG_WIDTH,
    });
  }

  private openDeleteDialog(publicKey: string): void {
    this.dialog.open(DeleteSelectedAccountsComponent, {
      data: [publicKey],
      width: DIALOG_WIDTH,
    });
  }
}
