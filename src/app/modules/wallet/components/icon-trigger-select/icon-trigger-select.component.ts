import { Component, Input } from '@angular/core';

export interface MenuItem {
  disabled?: boolean;
  danger?: boolean;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-icon-trigger-select',
  templateUrl: './icon-trigger-select.component.html',
})
export class IconTriggerSelectComponent {
  @Input() icon: string | null = null;
  @Input() menuItems: MenuItem[] | null = null;
  constructor() { }
}
