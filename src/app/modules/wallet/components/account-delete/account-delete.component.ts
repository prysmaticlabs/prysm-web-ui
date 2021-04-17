import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PublicKeysRequest } from 'src/app/proto/validator/accounts/v2/web_api';
import { WalletService } from '../../../core/services/wallet.service';
import { tap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilityValidator } from '../../../onboarding/validators/utility.validator';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-account-delete',
  templateUrl: './account-delete.component.html',
  styleUrls: ['./account-delete.component.scss'],
})
export class AccountDeleteComponent implements OnInit {
  constructor(
    private ref: MatDialogRef<AccountDeleteComponent>,
    private walletService: WalletService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: string[]
  ) {
    this.publicKeys = this.data;
  }
  publicKeys: string[];
  confirmGroup: FormGroup = this.formBuilder.group({
    confirmation: ['', [Validators.required, UtilityValidator.MustBe('agree')]],
  });
  ngOnInit(): void {}

  cancel(): void {
    this.ref.close();
  }

  confirm(): void {
    const request = {
      publicKeys: this.data,
    } as PublicKeysRequest;

    this.walletService
      .deleteAccounts(request)
      .pipe(
        tap((x) => {
          this.notificationService.notifySuccess(
            `Successfully removed ${this.publicKeys.length} keys`
          );
          this.cancel();
        })
      )
      .subscribe();
  }
}
