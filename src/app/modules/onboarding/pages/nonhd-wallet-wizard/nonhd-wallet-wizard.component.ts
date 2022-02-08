import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Observable, Subject, throwError, zip } from 'rxjs';
import { catchError, delay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { PasswordValidator } from 'src/app/modules/core/validators/password.validator';

import {
  CreateWalletRequest,
  ImportKeystoresRequest,
  ImportSlashingProtectionRequest
} from 'src/app/proto/validator/accounts/v2/web_api';

import { LANDING_URL } from 'src/app/modules/core/constants';
import { ImportProtectionComponent } from 'src/app/modules/shared/components/import-protection/import-protection.component';
import { templateJitUrl } from '@angular/compiler';
import { ImportAccountsFormComponent } from 'src/app/modules/shared/components/import-accounts-form/import-accounts-form.component';


enum WizardState {
  WalletDir,
  UnlockAccounts,
  WebPassword,
}

type voidFunc = () => void;

@Component({
  selector: 'app-nonhd-wallet-wizard',
  templateUrl: './nonhd-wallet-wizard.component.html',
})
export class NonhdWalletWizardComponent implements OnInit, OnDestroy {
  @Input() resetOnboarding: voidFunc = ()=>{};

  // View children.
  @ViewChild('stepper') stepper?: MatStepper;
  @ViewChild('importAccounts') importAccounts: ImportAccountsFormComponent | undefined;
  @ViewChild('slashingProtection') slashingProtection: ImportProtectionComponent | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private walletService: WalletService,
  ) {}

  // Properties.
  private passwordValidator = new PasswordValidator();
  states = WizardState;
  loading = false;
  isSmallScreen = false;

  keystoresFormGroup = this.formBuilder.group({
    keystoresImported: this.formBuilder.array([], Validators.required) as FormArray
  });

  walletPasswordFormGroup = this.formBuilder.group({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),
    passwordConfirmation: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),
  }, {
    validators: this.passwordValidator.matchingPasswordConfirmation,
  });



  // Observables and subjects.
  destroyed$ = new Subject();

  ngOnInit(): void {
    this.registerBreakpointObserver();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  registerBreakpointObserver(): void {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).pipe(
      tap(result => {
        this.isSmallScreen = result.matches;
      }),
      takeUntil(this.destroyed$),
    ).subscribe();
  }

  nextStep(event: Event, state: WizardState): void {
    switch (state) {
      case WizardState.UnlockAccounts:
        this.keystoresFormGroup.markAllAsTouched();
        break;
    }
    if (this.keystoresFormGroup.valid && !this.slashingProtection?.invalid){
      this.stepper?.next();
    }
  }
  // logic was not intended to be so complicated...
  // api takes in a list of keystores and a password instead of a list of keystore password pairs
  // this goes through the logic of zipping the request as 1 request if the passwords are the same vs
  // 2 requests if the passwords are different
  // logic also on the import component
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
          keystores_imported: [keystore],
          keystores_password: keystorePasswords[index],
        };
        arrayOfRequests.push(this.walletService.importKeystores(req));
      });
      return zip(...arrayOfRequests);
    } else {
      const req: ImportKeystoresRequest = {
        keystores_imported: keystoresImported,
        keystores_password: keystorePasswords[0],
      };
      return this.walletService.importKeystores(req);
    }
    
  }

  createWallet(event: Event): void {
    event.stopPropagation();
    const request = {
      keymanager: 'IMPORTED',
      wallet_password: this.walletPasswordFormGroup.get('password')?.value,
    } as CreateWalletRequest;
   
    this.loading = true;
    // We attempt to create a wallet followed by a call to
    // signup using the wallet's password in the validator client.

    const observablesToExecute: Observable<any>[] = [this.importKeystores$];
   
    const slashingProtectionFile = this.slashingProtection?.importedFiles[0];
    if(slashingProtectionFile ){
      const reqImportSlashing: ImportSlashingProtectionRequest = {
        slashing_protection_json: JSON.stringify(slashingProtectionFile)
      }
      observablesToExecute.push(this.walletService.importSlashingProtection(reqImportSlashing));
    }
  
    this.walletService.createWallet(request).pipe(
      delay(2000),
      switchMap((resp) => {
        return zip(...observablesToExecute).pipe(
          switchMap((res) => {
            if(res){
              this.router.navigate([LANDING_URL]);
            }
            return res;
          })
        );
      }),
      catchError(err => {
        this.loading = false;
        return throwError(err);
      }),
    ).subscribe();
  }
}
