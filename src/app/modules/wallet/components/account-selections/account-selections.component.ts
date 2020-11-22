import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BEACONCHAIN_EXPLORER } from 'src/app/modules/core/constants';

import { TableData } from '../accounts-table/accounts-table.component';

@Component({
  selector: 'app-account-selections',
  templateUrl: './account-selections.component.html',
})
export class AccountSelectionsComponent {
  @Input() selection: SelectionModel<TableData> | null = null;
  constructor(
    private dialog: MatDialog,
  ) { }

  openExplorer(): void {
    if (window !== undefined) {
      const indices = this.selection?.selected.map((d: TableData) => d.index).join(',');
      if (indices) {
        window.open(`${BEACONCHAIN_EXPLORER}/dashboard?validators=${indices}`, '_blank');
      }
    }
  }
}
