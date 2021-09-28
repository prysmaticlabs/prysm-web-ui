import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/modules/auth/services/authentication.service';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { ImportKeystoresRequest } from 'src/app/proto/validator/accounts/v2/web_api';
import { KeystoreValidator } from '../../../onboarding/validators/keystore.validator';
import { NotificationService } from '../../../shared/services/notification.service';

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
    private notificationService: NotificationService,
    private keystoreValidator: KeystoreValidator
  ) {}
  loading = false;
  keystoresFormGroup = this.fb.group({
    keystoresImported: new FormControl([] as string[][], [
      this.keystoreValidator.validateIntegrity,
    ]),
    keystoresPassword: ['', Validators.required],
  });

  submit(): void {
    if (this.keystoresFormGroup.invalid) {
      return;
    }
    const req: ImportKeystoresRequest = {
      keystoresImported: this.keystoresFormGroup.controls.keystoresImported
        .value,
      keystoresPassword: this.keystoresFormGroup.controls.keystoresPassword
        .value,
    };
    this.loading = true;

    this.authService
      .prompt()
      .pipe(
        switchMap(() =>
          this.walletService.importKeystores(req).pipe(
            take(1),
            filter((result) => result !== undefined),
            tap(() => {
              this.notificationService.notifySuccess(
                'Successfully imported keystores'
              );

              this.loading = false;
              this.zone.run(() => {
                this.router.navigate(['/dashboard/wallet/accounts']);
              });
            }),
            catchError((err) => {
              this.loading = false;
              return throwError(err);
            })
          )
        )
      )
      .subscribe();
  }
}
