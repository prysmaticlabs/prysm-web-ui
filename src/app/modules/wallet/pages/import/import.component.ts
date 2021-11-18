import { Component, NgZone, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, throwError, zip } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { LANDING_URL } from 'src/app/modules/core/constants';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { ImportAccountsFormComponent } from 'src/app/modules/shared/components/import-accounts-form/import-accounts-form.component';
import { ImportProtectionComponent } from 'src/app/modules/shared/components/import-protection/import-protection.component';
import { ImportKeystoresRequest, ImportSlashingProtectionRequest } from 'src/app/proto/validator/accounts/v2/web_api';
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
    private notificationService: NotificationService,
  ) {}
  loading = false;
  keystoresFormGroup = this.formBuilder.group({
    keystoresImported: this.formBuilder.array([], Validators.required)
  });

  private get importKeystores$(): Observable<any>{
    const keystoresImported: string[] = [];
    let keystorePasswords: string[] = [];
    (this.keystoresFormGroup.controls['keystoresImported'] as FormArray).controls.forEach((keystore: AbstractControl) => {
      keystoresImported.push(JSON.stringify(keystore.get('keystore')?.value));
      keystorePasswords.push(keystore.get('keystorePassword')?.value);
    });
    if(this.importAccounts?.uniqueToggleFormControl.value){
      const arrayOfRequests: Observable<any>[] = [];
      keystoresImported.forEach((keystore: string, index: number) => {
        const req: ImportKeystoresRequest = {
          keystoresImported: [keystore],
          keystoresPassword: keystorePasswords[index],
        };
        arrayOfRequests.push(this.walletService.importKeystores(req));
      });
      return zip(...arrayOfRequests);
    } else {
      const req: ImportKeystoresRequest = {
        keystoresImported: keystoresImported,
        keystoresPassword: keystorePasswords[0],
      };
      return this.walletService.importKeystores(req);
    }
    
  }

  submit(): void {
    
    if (this.keystoresFormGroup.invalid || this.slashingProtection?.invalid) {
      return;
    }

    this.loading = true;

    const observablesToExecute: Observable<any>[] = [this.importKeystores$];
   
    const slashingProtectionFile = this.slashingProtection?.importedFiles[0];
    if(slashingProtectionFile ){
      const reqImportSlashing: ImportSlashingProtectionRequest = {
        slashingProtectionJson: JSON.stringify(slashingProtectionFile)
      }
      observablesToExecute.push(this.walletService.importSlashingProtection(reqImportSlashing));
    }

    zip(...observablesToExecute).pipe(
          take(1),
          switchMap((res) => {
            if(res){
              this.notificationService.notifySuccess(
                'Successfully imported keystores'
              );
  
              this.loading = false;
              this.zone.run(() => {
                this.router.navigate(['/' + LANDING_URL + '/wallet/accounts']);
              });
            }
            return res;
          }),
          catchError((err) => {
            this.loading = false;
            return throwError(err);
          })
    ).subscribe();
  }
}
