import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input } from '@angular/core';
import { TableData } from '../accounts-table/accounts-table.component';

@Component({
  selector: 'app-account-selections',
  templateUrl: './account-selections.component.html',
  styles: [
  ]
})
export class AccountSelectionsComponent {
  @Input() selection: SelectionModel<TableData> | null = null;
  constructor() { }
}
