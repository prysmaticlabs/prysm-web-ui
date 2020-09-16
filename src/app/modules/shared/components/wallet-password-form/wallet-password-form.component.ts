import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-wallet-password-form',
  templateUrl: './wallet-password-form.component.html',
})
export class WalletPasswordFormComponent {
  @Input() title: string | null = null;
  @Input() subtitle: string | null = null;
  @Input() formGroup: FormGroup | null = null;
  @Input() showSubmitButton: boolean | null = null;
  @Input() submit: () => void = () => {};
  constructor(
  ) { }
}
