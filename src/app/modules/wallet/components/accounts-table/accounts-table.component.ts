import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { OptionGroup } from '../icon-trigger-select/icon-trigger-select.component';

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
export class AccountsTableComponent implements OnInit {

  constructor() { }
  @Input() dataSource: MatTableDataSource<TableData> | null = null;
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
  optionGroups: OptionGroup[] = [
    {
      name: 'Details',
      options: [
        {value: 'view-beaconchain', viewValue: 'View in Explorer'},
        {value: 'deposit-data', viewValue: 'View Deposit Data'},
        {value: 'backup', viewValue: 'Backup Account'},
      ]
    },
    {
      name: 'Danger Zone',
      options: [
        {value: 'delete', viewValue: 'Delete Account', danger: true},
      ]
    },
  ];

  ngOnInit(): void {
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
