import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {map, debounceTime, take, switchMap, catchError} from 'rxjs/operators';

import { WalletService } from '../../core/services/wallet.service';
import { MAX_ALLOWED_KEYSTORES } from "../../core/constants";
import {ValidateKeystoresRequest} from "../../../proto/validator/accounts/v2/web_api";
import {HttpErrorResponse} from "@angular/common/http";

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
      const keystoresPassword = control.get('keystoresPassword')?.value;
      if (keystoresPassword === null) {
        return of(null);
      }
      const keystores: string[] = control.get('keystoresImported')?.value;
      if (!keystores.length) {
        return of(null);
      }
      const req: ValidateKeystoresRequest = {
        keystores,
        keystoresPassword,
      };
      return control.valueChanges.pipe(
        debounceTime(2000),
        take(1),
        switchMap(_ =>
          this.walletService.validateKeystores(req).pipe(
            catchError((err: HttpErrorResponse) => {
              console.log('logging', err);
              return of({ incorrectPassword: true });
            }),
          )
        ),
      );
    };
  }
}
