import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { from, throwError } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';

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
    private dialogRef: MatDialogRef<BackupSelectedAccountsComponent>,
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
    if (this.passwordGroup.invalid) {
      return;
    }
    const req: BackupAccountsRequest = {
      publicKeys: this.publicKeys,
      backupPassword: this.passwordGroup.controls.password.value,
    };
    this.loading = true;
    this.walletService.backupAccounts(req).pipe(
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

  downloadBackup(): void {
    if (!this.backupFile) {
      return;
    }
    from(JSZip.loadAsync(this.backupFile, { base64: true})).pipe(
      switchMap(zip =>
        from(zip.generateAsync({ type: 'blob' }))
      ),
      take(1),
      tap((blob: Blob) => {
        FileSaver.saveAs(blob, `backup-${Date.now()}.zip`);
        this.dialogRef.close();
      }),
      catchError(err => {
        return throwError(err);
      })
    ).subscribe();
  }
}
