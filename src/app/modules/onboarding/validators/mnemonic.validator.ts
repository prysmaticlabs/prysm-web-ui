import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, debounceTime, take, switchMap } from 'rxjs/operators';

import { WalletService } from '../../core/services/wallet.service';

// MnemonicValidator implements the AsyncValidatorFn interface
// from angular forms, allowing us to write a custom, asynchronous
// form validator which can leverage observables.
@Injectable({
  providedIn: 'root'
})
export class MnemonicValidator {
  constructor(private walletService: WalletService) {}

  matchingMnemonic(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return control.valueChanges.pipe(
        debounceTime(500),
        take(1),
        switchMap(_ =>
          this.walletService.generateMnemonic$.pipe(
            map(originalMnemonic => {
              if (control.value !== originalMnemonic) {
                return { mnemonicMismatch: true };
              }
              return null;
            })
          )
        )
      );
    };
  }
}