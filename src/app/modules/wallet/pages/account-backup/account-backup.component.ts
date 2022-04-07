import { Component } from '@angular/core';
import {
  AbstractControlOptions, FormBuilder, FormControl,
  Validators
} from '@angular/forms';
import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  BackupAccountsRequest,
  BackupAccountsResponse
} from 'src/app/proto/validator/accounts/v2/web_api';
import { WalletService } from '../../../core/services/wallet.service';
import { StaticPasswordValidator } from '../../../core/validators/password.validator';
import { UtilityValidator } from '../../../onboarding/validators/utility.validator';
import { BaseComponent } from '../../../shared/components/base.component';
import { NotificationService } from '../../../shared/services/notification.service';
@Component({
  selector: 'app-account-backup',
  templateUrl: './account-backup.component.html',
  styleUrls: ['./account-backup.component.scss'],
})
export class AccountBackupComponent extends BaseComponent {
  constructor(
    private walletService: WalletService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder
  ) {
    super();
  }

  toggledAll = new FormControl(false);
  accountBackForm = this.formBuilder.group({}, {
    validators: [UtilityValidator.LengthMustBeBiggerThanOrEqual(1)],
  } as AbstractControlOptions);
  encryptionPasswordForm = this.formBuilder.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ],
      ],
      passwordConfirmation: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ],
      ],
    },
    {
      validators: [StaticPasswordValidator.matchingPasswordConfirmation],
    } as AbstractControlOptions
  );

  backUp(): void {
    if (this.encryptionPasswordForm.invalid) {
      return;
    }
    const request = this.getRequestForm();
    this.backupRequest(request).subscribe((x) => this.back());
  }

  private backupRequest(
    request: BackupAccountsRequest
  ): Observable<BackupAccountsResponse> {
    return this.walletService.backUpAccounts(request).pipe(
      tap((response) => {
        // convert base64 string to byte array
        const blob = new Blob([this.convertBase64ToBytes(response.zip_file)], {type:"application/zip"});
        const d = new Date().toJSON().slice(0,10);
        const fileName = `account-backup_${d}.zip`;
        FileSaver.saveAs(blob, fileName);
        this.notificationService.notifySuccess(
          `Successfully backed up ${request.public_keys.length} accounts`
        );
      }),
      catchError((err) => {
        this.notificationService.notifyError('An error occurred during backup');
        throw err;
      })
    );
  }

  private getRequestForm(): BackupAccountsRequest {
    return {
      public_keys: Object.keys(this.accountBackForm.value),
      backup_password: this.encryptionPasswordForm.value.password,
    } as BackupAccountsRequest;
  }

  //convertBase64ToBytes is a utility function that can take in a base64 string and convert it to a byte array.
  //The prysm backup accounts api right now is returning a response of a base64 string.
  //Without this conversion, the file would be corrupted.
  private convertBase64ToBytes(data: string) {
    let byteCharacters = atob(data);
    let byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    return byteArray;
  }
}
