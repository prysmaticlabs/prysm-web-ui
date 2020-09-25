import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

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
  constructor() { }
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
      name: 'View in Explorer',
      icon: 'open_in_new',
    },
    {
      name: 'View Deposit Data',
      icon: 'pageview',
    },
    {
      name: 'Backup Account',
      icon: 'get_app',
    },
    {
      name: 'Delete Account',
      icon: 'delete',
      danger: true,
    },
  ];

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  // UI helpers for our template.
  masterToggle(): void {
    // this.isAllSelected() ?
    //     this.selection?.clear() :
    //     this.dataSource?.data.forEach(row => this.selection?.select(row));
  }

  isAllSelected(): boolean {
    // const numSelected = this.selection?.selected.length;
    // // const numRows = this.dataSource?.data.length;
    // return numSelected === numRows;
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
}
