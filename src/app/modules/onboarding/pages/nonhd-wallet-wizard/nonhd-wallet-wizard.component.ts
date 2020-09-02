import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';

import { tap, takeUntil, switchMap, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

import { PasswordValidator } from 'src/app/modules/core/validators/password.validator';
import { CreateWalletRequest, KeymanagerKind, WalletService } from 'src/app/modules/core/services/wallet.service';
import { AuthenticationService } from 'src/app/modules/core/services/auth.service';

const MAX_ALLOWED_KEYSTORES = 50;

@Component({
  selector: 'app-nonhd-wallet-wizard',
  templateUrl: './nonhd-wallet-wizard.component.html',
})
export class NonhdWalletWizardComponent implements OnInit, OnDestroy {
  @Input() resetOnboarding: () => void;
  // Properties.
  loading = false;
  isSmallScreen = false;
  importFormGroup: FormGroup;
  unlockFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
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
        [] as Uint8Array[], 
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

  registerBreakpointObserver() {
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

  updateImportedKeystores(uploadedKeystore: Uint8Array) {
    const imported = this.importFormGroup.get('keystoresImported').value;
    this.importFormGroup.get('keystoresImported').setValue([...imported, uploadedKeystore]);
  }

  validateImportedKeystores(control: AbstractControl) {
    const keystores: Uint8Array[] = control.get('keystoresImported').value;
    if (!keystores || keystores.length === 0) {
      control.get('keystoresImported').setErrors({ noKeystoresUploaded: true });
      return;
    }
    if (keystores.length > MAX_ALLOWED_KEYSTORES) {
      control.get('keystoresImported').setErrors({ tooManyKeystores: true });
    }
  }

  clickContinueImporting(event: Event) {
    event.stopPropagation();
    this.importFormGroup.markAllAsTouched();
    this.stepper.next();
  }

  createWallet(event: Event): void {
    event.stopPropagation();
    if (this.passwordFormGroup.invalid) {
      return;
    }
    const request: CreateWalletRequest = {
      keymanager: KeymanagerKind.Direct,
      walletPassword: this.passwordFormGroup.get('password').value,
      keystoresPassword: this.unlockFormGroup.get('keystoresPassword').value,
      keystoresImported: this.importFormGroup.get('keystoresImported').value,
    };
    this.loading = true;
    // We attempt to create a wallet followed by a call to
    // signup using the wallet's password in the validator client.
    this.walletService.createWallet(request).pipe(
      switchMap(() => {
        return this.authService.signup(request.walletPassword).pipe(
          tap(() => {
            this.router.navigate(['/dashboard/gains-and-losses']);
            this.loading = false;
          }),
          catchError(err => throwError(err)),
        );
      })
    ).subscribe();
  }
}