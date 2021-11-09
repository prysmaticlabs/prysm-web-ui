import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-accounts-form',
  templateUrl: './create-accounts-form.component.html',
})
export class CreateAccountsFormComponent {
  @Input() formGroup: FormGroup | null = null;
  @Input() title = 'Create new validator accounts';
  @Input() subtitle = `Generate new accounts in your wallet and obtain the deposit
  data you need to activate them into the deposit contract via the
  <a href="https://medalla.launchpad.ethereum.org/" target="_blank" class="text-primary">eth2 launchpad</a>`;
  constructor() { }
}
