import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Subject, throwError } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { PasswordValidator } from 'src/app/modules/core/validators/password.validator';
import { CreateWalletRequest, CreateWalletResponse } from 'src/app/proto/validator/accounts/v2/web_api';
import { MnemonicValidator } from '../../validators/mnemonic.validator';



enum WizardState {
  Overview,
  ConfirmMnemonic,
  WalletDir,
  GenerateAccounts,
  WalletPassword,
}

type voidFunc = () => void;

@Component({
  selector: 'app-hd-wallet-wizard',
  templateUrl: './hd-wallet-wizard.component.html',
})
export class HdWalletWizardComponent implements OnInit, OnDestroy {
  @Input() resetOnboarding: voidFunc = ()=>{};
  constructor(
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private mnemonicValidator: MnemonicValidator,
    private walletService: WalletService,
  ) {}

  // Properties.
  private passwordValidator = new PasswordValidator();
  states = WizardState;
  isSmallScreen = false;
  loading = false;
  mnemonicFormGroup = this.formBuilder.group({
    mnemonic: new FormControl('',
      // Synchronous validators.
      [
        Validators.required,
        this.mnemonicValidator.properFormatting,
      ],
      // Asynchronous validator to check if the mnemonic
      // matches the generated mnemonic from the wallet service.
      [this.mnemonicValidator.matchingMnemonic()]
    ),
  });
  accountsFormGroup = this.formBuilder.group({
    numAccounts: new FormControl('', [
      Validators.required,
      Validators.min(1),
    ]),
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

  // View children.
  @ViewChild('stepper') stepper?: MatStepper;

  // Observables and subjects.
  destroyed$ = new Subject();

  ngOnInit(): void {
    this.registerBreakpointObserver();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(undefined);
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
    event.stopPropagation();
    switch (state) {
      case WizardState.ConfirmMnemonic:
        this.mnemonicFormGroup.markAllAsTouched();
        break;
      case WizardState.GenerateAccounts:
        this.accountsFormGroup.markAllAsTouched();
        break;
    }
    this.stepper?.next();
  }

  createWallet(event: Event): void {
    event.stopPropagation();
    const request = {
      keymanager: 'DERIVED',
      wallet_password: this.walletPasswordFormGroup.controls.password.value,
      num_accounts: this.accountsFormGroup.controls.numAccounts.value,
      mnemonic: this.mnemonicFormGroup.controls.mnemonic.value,
    } as CreateWalletRequest;
    this.loading = true;
    // We attempt to create a wallet followed by a call to
    // signup using the wallet's password in the validator client.
    this.walletService.createWallet(request).pipe(
            tap((res: CreateWalletResponse) => {
              this.loading = false;
            }),
            catchError(err => {
              this.loading = false;
              return throwError(err);
            })
      ).subscribe();
  }
}
