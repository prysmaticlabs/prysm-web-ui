import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { DeleteAccountsRequest } from 'src/app/proto/validator/accounts/v2/web_api';
import { WalletService } from '../../../core/services/wallet.service';
import { UtilityValidator } from '../../../onboarding/validators/utility.validator';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-account-delete',
  templateUrl: './account-delete.component.html',
  styleUrls: ['./account-delete.component.scss'],
})
export class AccountDeleteComponent {
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
  

  cancel(): void {
    this.ref.close();
  }

  confirm(): void {
    const request = {
      publicKeys: this.data,
    } as DeleteAccountsRequest;

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
