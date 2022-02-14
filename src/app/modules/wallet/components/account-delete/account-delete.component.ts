import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { base64ToHex } from 'src/app/modules/core/utils/hex-util';
import { DeleteAccountsRequest,DeleteAccountsData,DeleteAccountsResponse } from 'src/app/proto/validator/accounts/v2/web_api_keymanager-api';
import { WalletService } from '../../../core/services/wallet.service';
import { UtilityValidator } from '../../../onboarding/validators/utility.validator';

@Component({
  selector: 'app-account-delete',
  templateUrl: './account-delete.component.html',
  styleUrls: ['./account-delete.component.scss'],
})
export class AccountDeleteComponent {
  constructor(
    private ref: MatDialogRef<AccountDeleteComponent>,
    private walletService: WalletService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
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
    const hexKeys = this.data.map(key => base64ToHex(key));
    const request = {
      pubkeys: hexKeys,
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
              this.toastr.success(
                `${hexKeys[index].substring(0, 10)}... Deleted`,
              );
            } else {
              this.toastr.error(
                `${hexKeys[index].substring(0, 10)}... status: ${data.status}`,
                `${data.message !== ''? data.message : 'Delete failed'}`,{
                timeOut: 20000,
              });
            }
          });
          this.cancel();
        })
      )
      .subscribe();
  }
}
