import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-choose-wallet-password',
  templateUrl: './choose-wallet-password.component.html',
})
export class ChooseWalletPasswordComponent {
  @Input() formGroup: FormGroup | null = null;
  constructor() { }
}
