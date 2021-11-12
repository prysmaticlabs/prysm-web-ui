import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { PasswordValidator } from 'src/app/modules/core/validators/password.validator';

import {
  CreateWalletRequest,
  ImportKeystoresRequest
} from 'src/app/proto/validator/accounts/v2/web_api';
import { KeystoreValidator } from '../../validators/keystore.validator';

import { LANDING_URL } from 'src/app/modules/core/constants';


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

  constructor(
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private keystoreValidator: KeystoreValidator,
    private router: Router,
    private walletService: WalletService,
  ) {}

  // Properties.
  private passwordValidator = new PasswordValidator();
  states = WizardState;
  loading = false;
  isSmallScreen = false;

  keystoresFormGroup = this.formBuilder.group({
    keystoresImported: this.formBuilder.array([]) as FormArray
  });
//,keystoresPassword: ['', Validators.required]
  // new FormControl([] as string[][], [
  //   this.keystoreValidator.validateIntegrity,
  // ]),
  //  asyncValidators: this.keystoreValidator.correctPassword(),

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

  // View children.
  @ViewChild('stepper') stepper?: MatStepper;

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
    if (this.keystoresFormGroup.valid){
      this.stepper?.next();
    }
  }

  createWallet(event: Event): void {
    event.stopPropagation();
    const request = {
      keymanager: 'IMPORTED',
      walletPassword: this.walletPasswordFormGroup.get('password')?.value,
    } as CreateWalletRequest;
    const importRequest = {
      keystoresPassword: this.keystoresFormGroup.get('keystoresPassword')?.value,
      keystoresImported: this.keystoresFormGroup.get('keystoresImported')?.value,
    } as ImportKeystoresRequest;
    this.loading = true;
    // We attempt to create a wallet followed by a call to
    // signup using the wallet's password in the validator client.
    this.walletService.createWallet(request).pipe(
      switchMap(() => {
        return this.walletService.importKeystores(importRequest).pipe(
          tap(() => {
            this.router.navigate([LANDING_URL]);
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
