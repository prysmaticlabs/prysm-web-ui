import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { PasswordValidator } from 'src/app/modules/core/validators/password.validator';
import { ChangePasswordRequest } from 'src/app/proto/validator/accounts/v2/web_api';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {
  constructor(
    private formBuilder: FormBuilder,
    private walletService: WalletService,
    private snackBar: MatSnackBar,
  ) { }

  private passwordValidator = new PasswordValidator();
  formGroup = this.formBuilder.group({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      this.passwordValidator.strongPassword,
    ]),
    passwordConfirmation: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      this.passwordValidator.strongPassword,
    ]),
  }, {
    validators: this.passwordValidator.matchingPasswordConfirmation,
  });

  resetPassword(): void {
    const req: ChangePasswordRequest = {
      password: this.formGroup.controls.password.value,
      passwordConfirmation: this.formGroup.controls.passwordConfirmation.value,
    };
    this.walletService.changeWalletPassword(req).pipe(
      take(1),
      tap(() => {
        this.snackBar.open('Successfully changed wallet password', 'Close', {
          duration: 4000,
        });
      }),
      catchError(err => {
        return throwError(err);
      })
    ).subscribe();
  }
}
