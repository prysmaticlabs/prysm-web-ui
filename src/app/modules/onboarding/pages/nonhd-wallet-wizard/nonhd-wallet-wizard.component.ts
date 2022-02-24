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
} from 'src/app/proto/validator/accounts/v2/web_api';

import { LANDING_URL } from 'src/app/modules/core/constants';
import { ImportProtectionComponent } from 'src/app/modules/shared/components/import-protection/import-protection.component';


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

  private get importKeystores$(): Observable<any>{
    const keystoresImported: string[] = [];
    const keystorePasswords: string[] = [];
    (this.keystoresFormGroup.controls['keystoresImported'] as FormArray).controls.forEach((keystore: AbstractControl) => {
      keystoresImported.push(JSON.stringify(keystore.get('keystore')?.value));
      keystorePasswords.push(keystore.get('keystorePassword')?.value);
    });
    const slashingProtectionFile = this.slashingProtection?.importedFiles[0];
    const req: ImportKeystoresRequest = {
      keystores: keystoresImported,
      passwords: keystorePasswords,
      slashing_protection: slashingProtectionFile ? JSON.stringify(slashingProtectionFile) : null,
    };
    return this.walletService.importKeystores(req);
    
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
    // a delay after the create wallet as it is non blocking once the wallet is created.
    // the import keystores request requires a keymanager to be set which is retreived from the wallet.
    // if the import keystores request is called too soon after wallet creation the keymanager may not yet be set.
    this.walletService.createWallet(request).pipe(
      delay(2000),
      switchMap((resp) => {
        return this.importKeystores$.pipe(
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
