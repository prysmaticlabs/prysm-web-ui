import { Clipboard } from '@angular/cdk/clipboard';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BEACONCHAIN_EXPLORER, LANDING_URL } from 'src/app/modules/core/constants';
import { base64ToHex } from 'src/app/modules/core/utils/hex-util';
import { AccountDeleteComponent } from '../account-delete/account-delete.component';
import { EditFeeRecipientComponent } from '../fee-recipient/fee-recipient-edit.component';
import { MenuItem } from '../icon-trigger-select/icon-trigger-select.component';


export interface TableData {
  select: number;
  accountName: string;
  index: number;
  publicKey: string;
  feeRecipient: string;
  balance: string;
  effectiveBalance: string;
  status: string;
  activationEpoch: string;
  exitEpoch: string;
  lowBalance: boolean;
  options: string;
}

@Component({
  selector: 'app-accounts-table',
  templateUrl: './accounts-table.component.html',
})
export class AccountsTableComponent implements AfterViewInit,OnChanges {
  @Input() dataSource: MatTableDataSource<TableData> | null = null;
  @Input() selection: SelectionModel<TableData> | null = null;
  @ViewChild(MatSort, { static: false }) sort: MatSort | null = null;

  readonly LANDING_URL = '/' + LANDING_URL;
  readonly UNSET_RECIPIENT = "set by beacon node";

  constructor(
    private dialog: MatDialog,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar
  ) {}

  displayedColumns: string[] = [
    'select',
    'accountName',
    'publicKey',
    'index',
    'feeRecipient',
    'balance',
    'effectiveBalance',
    'activationEpoch',
    'exitEpoch',
    'status',
    'options',
  ];
  menuItems: MenuItem[] = [
    {
      name: 'Edit Fee Recipient',
      icon: 'open_in_new',
      action: this.openEditFeeRecipientDialog.bind(this),
    },
    {
      name: 'View On Beaconcha.in Explorer',
      icon: 'open_in_new',
      action: this.openExplorer.bind(this),
    }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.dataSource && this.dataSource){
      this.dataSource.sort = this.sort;
    }
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  masterToggle(): void {
    if (this.dataSource && this.selection) {
      const sel = this.selection;
      this.isAllSelected()
        ? sel.clear()
        : this.dataSource.data.forEach((row) => sel.select(row));
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

  copyKeyToClipboard(publicKey: string): void {
    const hex = base64ToHex(publicKey);
    this.clipboard.copy(hex);
    this.snackBar.open(`Copied ${hex.slice(0, 16)}... to Clipboard`, 'Close', {
      duration: 4000,
    });
  }

  copyFeeRecipientToClipboard(feeRecipient: string):void {
    this.clipboard.copy(feeRecipient);
    this.snackBar.open(`Copied ${feeRecipient.slice(0, 16)}... to Clipboard`, 'Close', {
      duration: 4000,
    });
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

  private openExplorer(row: TableData): void {
    let publicKey = row.publicKey
    if (window !== undefined) {
      let hex = base64ToHex(publicKey);
      hex = hex.replace('0x', '');
      window.open(`${BEACONCHAIN_EXPLORER}/validator/${hex}`, '_blank');
    }
  }

  openDeleteDialog(publicKey: string): void {
    const d = this.dialog.open(AccountDeleteComponent, {
      width: '600px',
      data: [publicKey],
    });
  }

  private openEditFeeRecipientDialog(row: TableData): void {
    const d = this.dialog.open(EditFeeRecipientComponent, {
      width: '600px',
      data: {publickey:row.publicKey,ethaddress:row.feeRecipient},
    });
  }
}
