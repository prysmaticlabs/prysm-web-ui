import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { catchError, delay, take, tap } from 'rxjs/operators';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { PasswordValidator } from 'src/app/modules/core/validators/password.validator';
import { BackupAccountsRequest, BackupAccountsResponse } from 'src/app/proto/validator/accounts/v2/web_api';

@Component({
  selector: 'app-backup-selected-accounts',
  templateUrl: './backup-selected-accounts.component.html',
})
export class BackupSelectedAccountsComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public publicKeys: string[],
    private fb: FormBuilder,
    private walletService: WalletService,
  ) { }

  private passwordValidator = new PasswordValidator();
  loading = false;
  backupFile: string | null = null;
  passwordGroup = this.fb.group({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      this.passwordValidator.strongPassword,
    ]),
  });

  backup(): void {
    const req: BackupAccountsRequest = {
      publicKeys: this.publicKeys,
      keystoresPassword: this.passwordGroup.controls.password.value,
    };
    this.loading = true;
    this.walletService.backupAccounts(req).pipe(
      delay(3000),
      take(1),
      tap((res: BackupAccountsResponse) => {
        this.loading = false;
        this.backupFile = res.zipFile;
      }),
      catchError(err => {
        this.loading = false;
        return throwError(err);
      })
    ).subscribe();
  }
}
