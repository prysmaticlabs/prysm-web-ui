import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { DeleteAccountsRequest,DeleteAccountsData,DeleteAccountsResponse } from 'src/app/proto/validator/accounts/v2/web_api_keymanager-api';
import { WalletService } from '../../../core/services/wallet.service';
import { UtilityValidator } from '../../../onboarding/validators/utility.validator';

@Component({
  selector: 'app-account-delete',
  templateUrl: './account-delete.component.html',
  styleUrls: ['./account-delete.component.scss'],
})
export class AccountDeleteComponent {
  readonly SPECIFIC_KEYS = 'specific';
  readonly MANUAL_KEYS = 'manual';
  publicKeys: string[];
  deleteKeysType: string;

  addPubkeyControl = this.formBuilder.control(null,[ Validators.pattern('^(0x){1}[A-Fa-f0-9]{96}$')]);
  confirmGroup: FormGroup = this.formBuilder.group({
    isAutoDownload: [true],
    confirmation: ['', [Validators.required, UtilityValidator.MustBe('agree')]],
  });

  constructor(
    private ref: MatDialogRef<AccountDeleteComponent>,
    private walletService: WalletService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) private data: string[]
  ) {
    this.publicKeys = this.data;
    if(this.data && this.data.length > 0){
      this.deleteKeysType = this.SPECIFIC_KEYS;
    } else {
      this.deleteKeysType = this.MANUAL_KEYS;
    }
  }
 
  cancel(): void {
    this.ref.close();
  }

  addKey(){
    this.publicKeys.push(this.addPubkeyControl.value);
    this.addPubkeyControl.reset();
  }

  confirm(): void {
    const hexKeys = this.data;
    const request = {
      pubkeys: this.deleteKeysType === this.SPECIFIC_KEYS? hexKeys : this.publicKeys,
    } as DeleteAccountsRequest;

    this.walletService
      .deleteAccounts(request)
      .pipe(
        tap((resp:DeleteAccountsResponse) => {
          if (resp && 
            resp.slashing_protection && 
            this.confirmGroup.controls['isAutoDownload'].value === true) {
             const d = new Date().toJSON().slice(0,10);
             let fileToSave = new Blob([resp.slashing_protection], {
               type: 'application/json'
             });
             let fileName = `slashing_protection_${d}.json`;
             FileSaver.saveAs(fileToSave, fileName);
            }
            resp.data.forEach((data:DeleteAccountsData,index:number) => {
              let pubkey = hexKeys[index]?hexKeys[index].substring(0, 10):'undefined pubkey';
              if(data.status && data.status.toUpperCase() === 'DELETED'){
                this.toastr.success(
                  `${pubkey}... Deleted`,
                );
              } else {
                this.toastr.error(
                  `${pubkey}... status: ${data.status}`,
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
