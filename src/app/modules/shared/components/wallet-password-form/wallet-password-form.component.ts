import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-wallet-password-form',
  templateUrl: './wallet-password-form.component.html',
})
export class WalletPasswordFormComponent {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() formGroup: FormGroup;
  @Input() showSubmitButton: boolean;
  @Input() submit: () => void;
  constructor(
  ) { }
}
