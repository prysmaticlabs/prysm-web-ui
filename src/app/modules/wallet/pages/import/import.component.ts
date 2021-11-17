import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, throwError, zip } from 'rxjs';
import { catchError, filter, take, tap } from 'rxjs/operators';
import { LANDING_URL } from 'src/app/modules/core/constants';

import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { ImportProtectionComponent } from 'src/app/modules/shared/components/import-protection/import-protection.component';
import { ImportKeystoresRequest, ImportSlashingProtectionRequest } from 'src/app/proto/validator/accounts/v2/web_api';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
})
export class ImportComponent {
  @ViewChild('slashingProtection') slashingProtection: ImportProtectionComponent | undefined;
  
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

  submit(): void {
    
    if (this.keystoresFormGroup.invalid) {
      return;
    }
    const req: ImportKeystoresRequest = {
      keystoresImported: this.keystoresFormGroup.controls.keystoresImported
        .value,
      keystoresPassword: this.keystoresFormGroup.controls.keystoresPassword
        .value,
    };
    
    this.loading = true;

    let importKeystores$: Observable<any>= this.walletService.importKeystores(req);
    const slashingProtectionFile = this.slashingProtection?.importedFiles[0];
    if(slashingProtectionFile ){
      const reqImportSlashing: ImportSlashingProtectionRequest = {
        slashingProtectionJson: JSON.stringify(slashingProtectionFile)
      }
      importKeystores$ = zip(this.walletService.importKeystores(req), this.walletService.importSlashingProtection(reqImportSlashing));
    }

    importKeystores$.pipe(
          take(1),
          tap(() => {
            this.notificationService.notifySuccess(
              'Successfully imported keystores'
            );

            this.loading = false;
            this.zone.run(() => {
              this.router.navigate(['/' + LANDING_URL + '/wallet/accounts']);
            });
          }),
          catchError((err) => {
            this.loading = false;
            return throwError(err);
          })
    ).subscribe();
  }
}
