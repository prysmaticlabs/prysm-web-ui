import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { throwError } from 'rxjs';
import { catchError, delay, take, tap } from 'rxjs/operators';

import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { DeleteAccountsRequest, DeleteAccountsResponse } from 'src/app/proto/validator/accounts/v2/web_api';

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
    const req: DeleteAccountsRequest = {
      publicKeys: this.publicKeys,
    };
    this.loading = true;
    this.walletService.deleteAccounts(req).pipe(
      take(1),
      delay(3000),
      tap((res: DeleteAccountsResponse) => {
        this.loading = false;
        this.snackBar.open('Accounts successfully deleted', 'Close', {
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

  private validateConfirmation(control: AbstractControl): {[key: string]: any} | null {
    if (control.value) {
      const str = control.value as string;
      if (str.trim().toLowerCase() !== 'delete selected') {
        return { wrongValue: true };
      }
    }
    return null;
  }
}
