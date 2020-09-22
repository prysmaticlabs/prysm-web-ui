import { Component, Input } from '@angular/core';

export interface Option {
  value: string;
  viewValue: string;
  danger?: boolean;
}

export interface OptionGroup {
  disabled?: boolean;
  name: string;
  options: Option[];
}

@Component({
  selector: 'app-icon-trigger-select',
  templateUrl: './icon-trigger-select.component.html',
})
export class IconTriggerSelectComponent {
  @Input() icon: string | null = null;
  @Input() groups: OptionGroup[] | null = null;
  constructor() { }
  show = false;
}
