import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/modules/core/services/authentication.service';
import { PasswordValidator } from 'src/app/modules/core/validators/password.validator';
import { AuthRequest } from 'src/app/proto/validator/accounts/v2/web_api';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  passwordValidator = new PasswordValidator();
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

  signup(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) {
      console.log(this.formGroup.invalid);
      return;
    }
    const req: AuthRequest = {
      password: this.formGroup.controls.password.value,
      passwordConfirmation: this.formGroup.controls.passwordConfirmation.value,
    };
    this.authService.signup(req).pipe(
      take(1),
      tap(() => {
        console.log('dones');
        this.snackBar.open('Successfully signed up for Prysm web', 'Close', {
          duration: 4000,
        });
        this.router.navigate(['/dashboard/gains-and-losses']);
      }),
      catchError(err => {
        return throwError(err);
      })
    ).subscribe();
  }
}
