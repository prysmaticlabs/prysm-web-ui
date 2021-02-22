import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { takeUntil, tap, catchError } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';

import { PasswordValidator } from 'src/app/modules/core/validators/password.validator';
import { AuthenticationService } from '../../core/services/authentication.service';
import { AuthRequest } from 'src/app/proto/validator/accounts/v2/web_api';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  returnUrl = '';
  loading = false;
  submitted = false;
  destroyed$ = new Subject();
  passwordValidator = new PasswordValidator();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    public dialogRef: MatDialogRef<LoginComponent>,
  ) {
    this.loginForm = this.formBuilder.group({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator.strongPassword,
      ]),
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onSubmit(): void {
    this.submitted = true;
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }
    const password = this.loginForm.get('password')?.value as string;
    this.loading = true;
    this.authService.login({ password } as AuthRequest).pipe(
      tap(() => {
        this.loading = false;
        this.dialogRef.close();
      }),
      takeUntil(this.destroyed$),
      catchError(err => {
        this.loading = false;
        return throwError(err);
      })
    ).subscribe();
  }
}
