import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';

import { tap, takeUntil, switchMap, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

import { PasswordValidator } from 'src/app/modules/core/validators/password.validator';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { AuthenticationService } from 'src/app/modules/core/services/auth.service';
import { CreateWalletRequest, CreateWalletRequest_KeymanagerKind } from 'src/app/proto/validator/accounts/v2/web_api';

const MAX_ALLOWED_KEYSTORES = 50;

enum WizardState {
  Overview,
  ImportAccounts,
  UnlockAccounts,
}

@Component({
  selector: 'app-nonhd-wallet-wizard',
  templateUrl: './nonhd-wallet-wizard.component.html',
})
export class NonhdWalletWizardComponent implements OnInit, OnDestroy {
  @Input() resetOnboarding: () => void | null = null;
  // Properties.
  states = WizardState;
  loading = false;
  isSmallScreen = false;
  importFormGroup: FormGroup | null = null;
  unlockFormGroup: FormGroup  | null = null;
  passwordFormGroup: FormGroup  | null = null;
  private passwordValidator = new PasswordValidator();

  // View children.
  @ViewChild('stepper') stepper: MatStepper;

  // Observables and subjects.
  destroyed$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authService: AuthenticationService,
    private walletService: WalletService,
  ) {}

  ngOnInit(): void {
    this.registerFormGroups();
    this.registerBreakpointObserver();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  registerFormGroups(): void {
    this.importFormGroup = this.formBuilder.group({
      keystoresImported: [
        [] as string[],
      ]
    }, {
      validators: this.validateImportedKeystores,
    });
    this.unlockFormGroup = this.formBuilder.group({
      keystoresPassword: ['', Validators.required]
    });
    this.passwordFormGroup = this.formBuilder.group({
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
    this.stepper.next();
  }

  createWallet(event: Event): void {
    event.stopPropagation();
    if (this.passwordFormGroup.invalid) {
      return;
    }
    const request = {
      keymanager: CreateWalletRequest_KeymanagerKind.DIRECT,
      walletPassword: this.passwordFormGroup.get('password')?.value,
      keystoresPassword: this.unlockFormGroup.get('keystoresPassword')?.value,
      keystoresImported: this.importFormGroup.get('keystoresImported')?.value,
    } as CreateWalletRequest;
    this.loading = true;
    // We attempt to create a wallet followed by a call to
    // signup using the wallet's password in the validator client.
    this.walletService.createWallet(request).pipe(
      switchMap(() => {
        return this.authService.signup(request.walletPassword).pipe(
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
