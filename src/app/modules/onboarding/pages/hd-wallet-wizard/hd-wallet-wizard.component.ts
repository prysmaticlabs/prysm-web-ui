import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatStepper } from '@angular/material/stepper';

import { tap, takeUntil, catchError, switchMap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

import { AuthenticationService } from 'src/app/modules/core/services/authentication.service';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { MnemonicValidator } from '../../validators/mnemonic.validator';
import { PasswordValidator } from 'src/app/modules/core/validators/password.validator';
import { CreateWalletRequest } from 'src/app/proto/validator/accounts/v2/web_api';

enum WizardState {
  Overview,
  ConfirmMnemonic,
  GenerateAccounts,
}

type voidFunc = () => void;

@Component({
  selector: 'app-hd-wallet-wizard',
  templateUrl: './hd-wallet-wizard.component.html',
})
export class HdWalletWizardComponent implements OnInit, OnDestroy {
  @Input() resetOnboarding: voidFunc | null = null;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private mnemonicValidator: MnemonicValidator,
    private walletService: WalletService,
    private authService: AuthenticationService,
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
      Validators.min(0),
    ]),
  });
  passwordFormGroup = this.formBuilder.group({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      this.passwordValidator.strongPassword,
    ]),
    passwordConfirmation: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      this.passwordValidator.strongPassword,
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
      walletPassword: this.passwordFormGroup.controls.password.value,
      numAccounts: this.accountsFormGroup.controls.numAccounts.value,
      mnemonic: this.mnemonicFormGroup.controls.mnemonic.value,
    } as CreateWalletRequest;
    this.loading = true;
    // We attempt to create a wallet followed by a call to
    // signup using the wallet's password in the validator client.
    this.authService.signup(request.walletPassword).pipe(
      switchMap(() => {
        return this.walletService.createWallet(request).pipe(
          tap(() => {
            this.router.navigate(['/dashboard/gains-and-losses']);
          }),
          catchError(err => {
            this.loading = false;
            return throwError(err);
          }),
        );
      })
    ).subscribe();
  }
}
