import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, first, switchMap } from 'rxjs/operators';
import { ValidateKeystoresRequest } from '../../../proto/validator/accounts/v2/web_api';
import { WalletService } from '../../core/services/wallet.service';


// KeystoreValidator implements the AsyncValidatorFn interface
// from angular forms, allowing us to write a custom, asynchronous
// form validator which can leverage observables.
@Injectable({
  providedIn: 'root'
})
export class KeystoreValidator {
  constructor(private walletService: WalletService) {}

  validateIntegrity(control: AbstractControl): ValidationErrors | null {
    const keystores: Uint8Array[] = control.value;
    if (!keystores || keystores.length === 0) {
      return { noKeystoresUploaded: true };
    }
    return null;
  }

  correctPassword(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      return control.valueChanges.pipe(
        debounceTime(500),
        switchMap((keystoreFG: any) => {
          if (!keystoreFG) {
            return of(null);
          }
          const keystoresPassword: string = keystoreFG.keystorePassword;
          if (keystoresPassword === '' || !keystoresPassword) {
            return of(null);
          }
          const req: ValidateKeystoresRequest = {
            keystores: [JSON.stringify(keystoreFG.keystore)],
            keystores_password: keystoresPassword,
          };
          return this.walletService.validateKeystores(req).pipe(
            switchMap(() => {
              control.get('keystorePassword')?.setErrors(null);
              return of(null);
            }),
            catchError((err: HttpErrorResponse) => {
              let formErr: object;
              if (err.status === 400) {
                formErr = { incorrectPassword: err.error.message };
              } else if (err.status === 401) {
                throw err;
              }else {
                formErr = { somethingWentWrong: true };
              }
              control.get('keystorePassword')?.setErrors(formErr);
              return of(formErr);
            }),
          );
        }),
        first()
      );
    };
  }
}

