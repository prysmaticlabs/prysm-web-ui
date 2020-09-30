import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { throwError } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';

import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { DeleteAccountsRequest, DeleteAccountsResponse } from 'src/app/proto/validator/accounts/v2/web_api';

// Confirmation text a user must input to confirm
// deletion of their selected accounts.
export const CONFIRMATION_TEXT = 'delete selected';

@Component({
  selector: 'app-delete-selected-accounts',
  templateUrl: './delete-selected-accounts.component.html',
})
export class DeleteSelectedAccountsComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public publicKeys: string[],
    private dialogRef: MatDialogRef<DeleteSelectedAccountsComponent>,
    private fb: FormBuilder,
    private walletService: WalletService,
    private snackBar: MatSnackBar,
  ) { }

  loading = false;
  confirmGroup = this.fb.group({
    confirmation: new FormControl('', [
      Validators.required,
      this.validateConfirmation,
    ]),
  });

  deleteAccounts(): void {
    if (this.confirmGroup.invalid) {
      return;
    }
    const req: DeleteAccountsRequest = {
      publicKeys: this.publicKeys,
    };
    this.loading = true;
    this.walletService.deleteAccounts(req).pipe(
      take(1),
      tap((res: DeleteAccountsResponse) => {
        this.loading = false;
        if (!res || !res.deletedKeys) {
          this.snackBar.open('Something went wrong, could not delete accounts', 'Close', {
            duration: 4000,
          });
          return;
        }
        this.snackBar.open(`${res?.deletedKeys?.length} accounts successfully deleted`, 'Close', {
          duration: 4000,
        });
        this.dialogRef.close();
      }),
      catchError(err => {
        this.loading = false;
        return throwError(err);
      })
    ).subscribe();
  }

  validateConfirmation(control: AbstractControl): {[key: string]: any} | null {
    if (control.value) {
      const str = control.value as string;
      if (str.trim().toLowerCase() !== CONFIRMATION_TEXT) {
        return { wrongValue: true };
      }
    }
    return null;
  }
}
