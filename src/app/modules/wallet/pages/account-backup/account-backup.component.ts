import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WalletService } from '../../../core/services/wallet.service';
import { catchError, map, tap } from 'rxjs/operators';
import {
  Account,
  BackupAccountsRequest,
  BackupAccountsResponse,
} from 'src/app/proto/validator/accounts/v2/web_api';
import {
  FormControl,
  Validators,
  FormBuilder,
  AbstractControlOptions,
  FormGroup,
} from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { StaticPasswordValidator } from '../../../core/validators/password.validator';
import { BaseComponent } from '../../../shared/components/base.component';
import * as FileSaver from 'file-saver';
import { NotificationService } from '../../../shared/services/notification.service';
import { UtilityValidator } from '../../../onboarding/validators/utility.validator';

@Component({
  selector: 'app-account-backup',
  templateUrl: './account-backup.component.html',
  styleUrls: ['./account-backup.component.scss'],
})
export class AccountBackupComponent extends BaseComponent implements OnInit {
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
          StaticPasswordValidator.strongPassword,
          Validators.minLength(8),
        ],
      ],
      passwordConfirmation: [
        '',
        [
          Validators.required,
          StaticPasswordValidator.strongPassword,
          Validators.minLength(8),
        ],
      ],
    },
    {
      validators: [StaticPasswordValidator.matchingPasswordConfirmation],
    } as AbstractControlOptions
  );
  ngOnInit(): void {}

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
      tap(() => {
        this.notificationService.notifySuccess(
          `Successfully backed up ${request.publicKeys.length} accounts`
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
      publicKeys: Object.keys(this.accountBackForm.value),
      keystoresPassword: this.encryptionPasswordForm.value.password,
    } as BackupAccountsRequest;
  }
}
