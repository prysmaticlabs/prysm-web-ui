import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAX_ACCOUNTS_CREATION } from 'src/app/modules/core/constants';

@Component({
  selector: 'app-create-accounts-form',
  templateUrl: './create-accounts-form.component.html',
})
export class CreateAccountsFormComponent {
  @Input() formGroup: FormGroup | null = null;
  @Input() title = 'Create new validator accounts';
  @Input() subtitle = `Generate at least 1 account(s) in your Prysm wallet`;
  constructor() { }
  maxAccounts = MAX_ACCOUNTS_CREATION;
}
