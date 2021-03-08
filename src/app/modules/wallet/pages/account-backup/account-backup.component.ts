import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AbstractControlOptions,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { StaticPasswordValidator } from '../../../core/validators/password.validator';
import { BaseComponent } from '../../../shared/components/base.component';
import { WalletService } from '../../../core/services/wallet.service';
import { BackupAccountsRequest } from 'src/app/proto/validator/accounts/v2/web_api';
import { catchError, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BackupAccountsResponse } from '../../../../proto/validator/accounts/v2/web_api';
import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-account-backup',
  templateUrl: './account-backup.component.html',
  styleUrls: ['./account-backup.component.scss'],
})
export class AccountBackupComponent extends BaseComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private walletService: WalletService,
    private snakBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {
    super();
  }

  publicKeys: string[] = [];
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
          Validators.minLength(8),
          StaticPasswordValidator.strongPassword,
        ],
      ],
    },
    {
      validators: [StaticPasswordValidator.matchingPasswordConfirmation],
    } as AbstractControlOptions
  );

  ngOnInit(): void {
    const keys = this.activatedRoute.snapshot.queryParams.publicKeys;
    if (Array.isArray(keys)) {
      this.publicKeys = keys;
    } else {
      this.publicKeys = [keys];
    }
  }

  backUp(): void {
    if (this.encryptionPasswordForm.invalid) {
      return;
    }
    const request = {
      publicKeys: this.publicKeys,
      keystoresPassword: this.encryptionPasswordForm.value.password,
    } as BackupAccountsRequest;
    this.backupRequest(request).subscribe((x) => this.back());
  }

  backUpAndDownload(): void {
    if (this.encryptionPasswordForm.invalid) {
      return;
    }

    const request = {
      publicKeys: this.publicKeys,
      keystoresPassword: this.encryptionPasswordForm.value.password,
    } as BackupAccountsRequest;

    this.backupRequest(request).subscribe((x: BackupAccountsResponse) => {
      const blob = new Blob([x.zipFile], {
        type: 'text/plain;charset=utf-8',
      });
      FileSaver.saveAs(blob, 'hello world.txt');
      this.back();
    });
  }

  private backupRequest(
    request: BackupAccountsRequest
  ): Observable<BackupAccountsResponse> {
    return this.walletService.backUpAccounts(request).pipe(
      tap(() => {
        this.snakBar.open('Successfully backed up the accounts', 'Success', {
          duration: 4000,
        });
      }),
      catchError((err) => {
        this.snakBar.open(
          'Error happened while backing up the accounts',
          'Error',
          {
            duration: 4000,
            panelClass: 'text-error',
          }
        );
        throw err;
      })
    );
  }
}
