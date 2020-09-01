import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';

import { tap, takeUntil, catchError, switchMap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

import { AuthenticationService } from 'src/app/modules/core/services/auth.service';
import { WalletService, CreateWalletRequest, KeymanagerKind } from 'src/app/modules/core/services/wallet.service';
import { MnemonicValidator } from '../../validators/mnemonic.validator';
import { PasswordValidator } from 'src/app/modules/shared/validators/password.validator';

@Component({
  selector: 'app-hd-wallet-wizard',
  templateUrl: './hd-wallet-wizard.component.html',
})
export class HdWalletWizardComponent implements OnInit {
  @Input() resetOnboarding: () => void;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private mnemonicValidator: MnemonicValidator,
    private passwordValidator: PasswordValidator,
    private walletService: WalletService,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar,
  ) {}

  // Properties.
  isSmallScreen = false;
  loading = false;
  mnemonicFormGroup: FormGroup;
  accountsFormGroup: FormGroup;
  passwordFormGroup: FormGroup;

  // View children.
  @ViewChild('stepper') stepper: MatStepper;

  // Observables and subjects.
  destroyed$ = new Subject();

  ngOnInit(): void {
    this.registerFormGroups();
    this.registerBreakpointObserver();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  registerFormGroups() {
    this.mnemonicFormGroup = this.formBuilder.group({
      mnemonic: new FormControl('',
        // Synchronous validators.
        [
          Validators.required,
          Validators.pattern(
            `[a-zA-Z ]*`, // Only words separated by spaces.
          )
        ],
        // Asynchronous validator to check if the mnemonic
        // matches the generated mnemonic from the wallet service.
        [this.mnemonicValidator.matchingMnemonic()]
      ),
    });
    this.accountsFormGroup = this.formBuilder.group({
      numAccounts: new FormControl('', [
        Validators.required,
        Validators.min(0),
      ]),
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

  createWallet(event: Event): void {
    event.stopPropagation();
    if (this.passwordFormGroup.invalid) {
      return;
    }
    const request: CreateWalletRequest = {
      keymanager: KeymanagerKind.Derived,
      walletPassword: this.passwordFormGroup.controls.password.value,
      numAccounts: this.accountsFormGroup.controls.numAccounts.value,
      mnemonic: this.mnemonicFormGroup.controls.mnemonic.value,
    }
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
          catchError(err => {
            this.snackBar.open('Oops Something Went Wrong!', 'Close', {
              duration: 2000,
            });
            return throwError(err);
          }),
        );
      })
    ).subscribe();
  }
}