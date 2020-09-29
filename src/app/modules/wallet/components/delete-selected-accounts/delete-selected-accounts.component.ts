import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { throwError } from 'rxjs';
import { catchError, delay, take, tap } from 'rxjs/operators';

import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { PasswordValidator } from 'src/app/modules/core/validators/password.validator';
import { DeleteAccountsRequest, DeleteAccountsResponse } from 'src/app/proto/validator/accounts/v2/web_api';

@Component({
  selector: 'app-delete-selected-accounts',
  templateUrl: './delete-selected-accounts.component.html',
})
export class DeleteSelectedAccountsComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public publicKeys: string[],
    private fb: FormBuilder,
    private walletService: WalletService,
  ) { }

  private passwordValidator = new PasswordValidator();
  loading = false;
  passwordGroup = this.fb.group({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      this.passwordValidator.strongPassword,
    ]),
  });

  backup(): void {
    const req: DeleteAccountsRequest = {
      publicKeys: this.publicKeys,
    };
    this.loading = true;
    this.walletService.deleteAccounts(req).pipe(
      take(1),
      delay(3000),
      tap((res: DeleteAccountsResponse) => {
        this.loading = false;
      }),
      catchError(err => {
        this.loading = false;
        return throwError(err);
      })
    ).subscribe();
  }
}
