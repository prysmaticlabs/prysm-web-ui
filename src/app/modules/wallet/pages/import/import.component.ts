import { Component, NgZone, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError, zip } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import { LANDING_URL } from 'src/app/modules/core/constants';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { ImportAccountsFormComponent } from 'src/app/modules/shared/components/import-accounts-form/import-accounts-form.component';
import { ImportProtectionComponent } from 'src/app/modules/shared/components/import-protection/import-protection.component';
import { ImportKeystoresData, ImportKeystoresRequest, ImportSlashingProtectionRequest } from 'src/app/proto/validator/accounts/v2/web_api';
import { NotificationService } from '../../../shared/services/notification.service';


@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
})
export class ImportComponent {
  @ViewChild('slashingProtection') slashingProtection: ImportProtectionComponent | undefined;
  @ViewChild('importAccounts') importAccounts: ImportAccountsFormComponent | undefined;
  constructor(
    private formBuilder: FormBuilder,
    private walletService: WalletService,
    private router: Router,
    private zone: NgZone,
    private toastr: ToastrService,
  ) {}
  loading = false;
  pubkeys: string[] = [];
  keystoresFormGroup = this.formBuilder.group({
    keystoresImported: this.formBuilder.array([], Validators.required)
  });
 
  private get importKeystores$(): Observable<any>{
    const keystoresImported: string[] = [];
    let keystorePasswords: string[] = [];
    const publicKeys: string[] = [];
    (this.keystoresFormGroup.controls['keystoresImported'] as FormArray).controls.forEach((keystore: AbstractControl) => {
      publicKeys.push(keystore.get('pubkeyShort')?.value);
      keystoresImported.push(JSON.stringify(keystore.get('keystore')?.value));
      keystorePasswords.push(keystore.get('keystorePassword')?.value);
    });
    const slashingProtectionFile = this.slashingProtection?.importedFiles[0];
    this.pubkeys = publicKeys;
    const req: ImportKeystoresRequest = {
      keystores: keystoresImported,
      passwords: keystorePasswords,
      slashing_protection: slashingProtectionFile ? JSON.stringify(slashingProtectionFile) : null,
    };
    return this.walletService.importKeystores(req);
    
  }

  submit(): void {
    
    if (this.keystoresFormGroup.invalid || this.slashingProtection?.invalid) {
      return;
    }

    this.loading = true;

    this.importKeystores$.pipe(
          take(1),
          tap((res) => {
            if(res){
              console.log(res);
              res.data.forEach((data:ImportKeystoresData,index:number) => {
                let pubkey = this.pubkeys[index]??'undefined pubkey';
                if(data.status && data.status.toUpperCase() === 'IMPORTED'){
                  this.toastr.success(
                    `${pubkey}... IMPORTED`,
                  );
                } else if ( data.status && data.status.toUpperCase() === 'DUPLICATE'){
                  this.toastr.warning(
                    `${pubkey}... DUPLICATE, no action taken`,
                  );
                }else {
                  this.toastr.error(
                    `${pubkey}... status: ${data.status}`,
                    `${data.message !== ''? data.message : 'IMPORT failed'}`,{
                    timeOut: 20000,
                  });
                }
              });
              this.loading = false;
              this.zone.run(() => {
                this.router.navigate(['/' + LANDING_URL + '/wallet/accounts']);
              });
            }
          }),
          catchError((err) => {
            this.loading = false;
            return throwError(err);
          })
    ).subscribe();
  }
}
