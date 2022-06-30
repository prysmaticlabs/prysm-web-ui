import { Component, Input } from '@angular/core';
import { TableData } from '../accounts-table/accounts-table.component';

export interface MenuItem {
  disabled?: boolean;
  danger?: boolean;
  name: string;
  icon: string;
  action: (row: TableData) => void;
}

@Component({
  selector: 'app-icon-trigger-select',
  templateUrl: './icon-trigger-select.component.html',
})
export class IconTriggerSelectComponent {
  @Input() data: TableData | null = null;
  @Input() icon: string | null = null;
  @Input() menuItems: MenuItem[] | null = null;
  constructor() { }
}
