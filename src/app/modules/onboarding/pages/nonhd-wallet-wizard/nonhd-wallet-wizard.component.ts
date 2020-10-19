import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';

import { delay, tap, takeUntil, switchMap, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

import { PasswordValidator } from 'src/app/modules/core/validators/password.validator';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { AuthenticationService } from 'src/app/modules/core/services/authentication.service';
import { CreateWalletRequest, ImportKeystoresRequest } from 'src/app/proto/validator/accounts/v2/web_api';
import { MAX_ALLOWED_KEYSTORES } from 'src/app/modules/core/constants';

enum WizardState {
  Overview,
  WalletDir,
  ImportAccounts,
  UnlockAccounts,
}

type voidFunc = () => void;

@Component({
  selector: 'app-nonhd-wallet-wizard',
  templateUrl: './nonhd-wallet-wizard.component.html',
})
export class NonhdWalletWizardComponent implements OnInit, OnDestroy {
  @Input() resetOnboarding: voidFunc | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authService: AuthenticationService,
    private walletService: WalletService,
  ) {}

  // Properties.
  private passwordValidator = new PasswordValidator();
  states = WizardState;
  loading = false;
  isSmallScreen = false;
  walletFormGroup = this.formBuilder.group({
    walletDir: ['', Validators.required]
  });
  importFormGroup = this.formBuilder.group({
    keystoresImported: [
      [] as string[],
    ]
  }, {
    validators: this.validateImportedKeystores,
  });
  unlockFormGroup = this.formBuilder.group({
    keystoresPassword: ['', Validators.required]
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

  validateImportedKeystores(control: AbstractControl): void {
    const keystores: Uint8Array[] = control.get('keystoresImported')?.value;
    if (!keystores || keystores.length === 0) {
      control.get('keystoresImported')?.setErrors({ noKeystoresUploaded: true });
      return;
    }
    if (keystores.length > MAX_ALLOWED_KEYSTORES) {
      control.get('keystoresImported')?.setErrors({ tooManyKeystores: true });
    }
  }

  nextStep(event: Event, state: WizardState): void {
    event.stopPropagation();
    switch (state) {
      case WizardState.ImportAccounts:
        this.importFormGroup.markAllAsTouched();
        break;
      case WizardState.UnlockAccounts:
        this.unlockFormGroup.markAllAsTouched();
        break;
    }
    this.stepper?.next();
  }

  createWallet(event: Event): void {
    event.stopPropagation();
    const request = {
      keymanager: 'IMPORTED',
      walletPath: this.walletFormGroup.get('walletDir')?.value,
      walletPassword: this.passwordFormGroup.get('password')?.value,
    } as CreateWalletRequest;
    const importRequest = {
      keystoresPassword: this.unlockFormGroup.get('keystoresPassword')?.value,
      keystoresImported: this.importFormGroup.get('keystoresImported')?.value,
    } as ImportKeystoresRequest;
    this.loading = true;
    // We attempt to create a wallet followed by a call to
    // signup using the wallet's password in the validator client.
    this.authService.signup(request.walletPassword, request.walletPath).pipe(
      delay(500), // Add short delay to prevent flickering in UI in case of error.
      switchMap(() =>
        this.walletService.createWallet(request)
      ),
      switchMap(() => {
        return this.walletService.importKeystores(importRequest).pipe(
          tap(() => {
            this.router.navigate(['/dashboard/gains-and-losses']);
          }),
          catchError(err => {
            this.loading = false;
            return throwError(err);
          }),
        );
      }),
      catchError(err => {
        this.loading = false;
        return throwError(err);
      }),
    ).subscribe();
  }
}
