import { Component, NgZone } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { MAX_ALLOWED_KEYSTORES } from 'src/app/modules/core/constants';
import { AuthenticationService } from 'src/app/modules/core/services/authentication.service';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { ImportKeystoresRequest } from 'src/app/proto/validator/accounts/v2/web_api';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
})
export class ImportComponent {
  constructor(
    private fb: FormBuilder,
    private walletService: WalletService,
    private snackBar: MatSnackBar,
    private router: Router,
    private zone: NgZone,
    private authService: AuthenticationService,
  ) { }
  loading = false;
  importFormGroup = this.fb.group({
    keystoresImported: [
      [] as string[],
    ]
  }, {
    validators: this.validateImportedKeystores,
  });
  passwordFormGroup = this.fb.group({
    keystoresPassword: ['', Validators.required]
  });

  submit(): void {
    if (this.importFormGroup.invalid || this.passwordFormGroup.invalid) {
      return;
    }
    const req: ImportKeystoresRequest = {
      keystoresImported: this.importFormGroup.controls.keystoresImported.value,
      keystoresPassword: this.passwordFormGroup.controls.keystoresPassword.value,
    };
    this.loading = true;

    this.authService.prompt().pipe(
      switchMap(() => this.walletService.importKeystores(req).pipe(
        take(1),
        filter(result => result !== undefined),
        tap(() => {
          this.snackBar.open('Successfully imported keystores', 'Close', {
            duration: 4000,
          });
          this.loading = false;
          this.zone.run(() => {
            this.router.navigate(['/dashboard/wallet/accounts']);
          });
        }),
        catchError(err => {
          this.loading = false;
          return throwError(err);
        })
      )),
    ).subscribe();
  }

  private validateImportedKeystores(control: AbstractControl): void {
    const keystores: Uint8Array[] = control.get('keystoresImported')?.value;
    if (!keystores || keystores.length === 0) {
      control.get('keystoresImported')?.setErrors({ noKeystoresUploaded: true });
      return;
    }
    if (keystores.length > MAX_ALLOWED_KEYSTORES) {
      control.get('keystoresImported')?.setErrors({ tooManyKeystores: true });
    }
  }
}
