import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {map, debounceTime, take, switchMap, catchError} from 'rxjs/operators';

import { WalletService } from '../../core/services/wallet.service';
import { MAX_ALLOWED_KEYSTORES } from '../../core/constants';
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
    if (keystores.length > MAX_ALLOWED_KEYSTORES) {
      return { tooManyKeystores: true };
    }
    return null;
  }

  correctPassword(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return control.valueChanges.pipe(
        debounceTime(500),
        take(1),
        switchMap(_ => {
          console.log('in switch map');
          const keystores: string[] = control.get('keystoresImported')?.value;
          if (!keystores.length) {
            console.log('no keystores');
            return of(null);
          }
          const keystoresPassword: string = control.get('keystoresPassword')?.value;
          if (keystoresPassword === null || keystoresPassword === '') {
            console.log('no keystores password');
            return of(null);
          }
          const req: ValidateKeystoresRequest = {
            keystores,
            keystoresPassword,
          };
          return this.walletService.validateKeystores(req).pipe(
            map(() => {
              console.log('in map null');
              return null;
            }),
            catchError((err: HttpErrorResponse) => {
              let formErr: object;
              if (err?.status === 400) {
                formErr = { incorrectPassword: err.error?.message };
              } else {
                formErr = { somethingWentWrong: true };
              }
              control.get('keystoresPassword')?.setErrors(formErr);
              return of(formErr);
            }),
          )
        }),
      );
    };
  }
}
