import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as FileSaver from 'file-saver';
import { tap } from 'rxjs/operators';
import { base64ToHex } from 'src/app/modules/core/utils/hex-util';
import { DeleteAccountsRequest,DeleteAccountsData,DeleteAccountsResponse } from 'src/app/proto/validator/accounts/v2/web_api_keymanager-api';
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
    isAutoDownload: [true],
    confirmation: ['', [Validators.required, UtilityValidator.MustBe('agree')]],
  });

  cancel(): void {
    this.ref.close();
  }

  confirm(): void {
    const request = {
      pubkeys: this.data,
    } as DeleteAccountsRequest;

    this.walletService
      .deleteAccounts(request)
      .pipe(
        tap((resp:DeleteAccountsResponse) => {
          if (resp && 
            resp.slashing_protection && 
            this.confirmGroup.controls['isAutoDownload'].value === true) {
             const d = new Date();
             let fileToSave = new Blob([resp.slashing_protection], {
               type: 'application/json'
             });
             let fileName = `slashing_protection_${d.toDateTimeString()}.json`;
             FileSaver.saveAs(fileToSave, fileName);
            }
          resp.data.forEach((data:DeleteAccountsData,index:number) => {
            if(data.status === 'DELETED'){
              this.notificationService.notifySuccess(
                `Successfully removed ${base64ToHex(this.data[index])}`
              );
            } else {
              this.notificationService.notifyError(
                `Failed to remove ${base64ToHex(this.data[index])} with status ${data.status} and message ${data.message}`
              );
            }
          });
          this.cancel();
        })
      )
      .subscribe();
  }
}
