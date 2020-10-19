import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PasswordValidator } from 'src/app/modules/core/validators/password.validator';

@Component({
  selector: 'app-wallet-password-form',
  templateUrl: './wallet-password-form.component.html',
})
export class WalletPasswordFormComponent {
  private passwordValidator = new PasswordValidator();
  @Input() title: string | null = null;
  @Input() subtitle: string | null = null;
  @Input() label: string | null = null;
  @Input() confirmationLabel: string | null = null;
  @Input() formGroup: FormGroup | null = null;
  @Input() showSubmitButton: boolean | null = null;
  @Input() submit: () => void = () => {};
  constructor(
  ) { }
}
