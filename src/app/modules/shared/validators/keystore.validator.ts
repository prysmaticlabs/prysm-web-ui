import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {map, debounceTime, take, switchMap, catchError, first, debounce} from 'rxjs/operators';

import { WalletService } from '../../core/services/wallet.service';
import { ValidateKeystoresRequest } from '../../../proto/validator/accounts/v2/web_api';
import { HttpErrorResponse } from '@angular/common/http';

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
          const keystoresPassword: string = keystoreFG.keystoresPassword;
          if (keystoresPassword === '') {
            return of(null);
          }
          const req: ValidateKeystoresRequest = {
            keystores: [keystoreFG.keystore],
            keystoresPassword: keystoresPassword,
          };
          return this.walletService.validateKeystores(req).pipe(
            switchMap(() => {
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

