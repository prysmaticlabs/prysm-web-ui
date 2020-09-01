import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatStepper } from '@angular/material/stepper';

import { tap, takeUntil, switchMap, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { CreateWalletRequest, KeymanagerKind, WalletService } from 'src/app/modules/core/services/wallet.service';
import { AuthenticationService } from 'src/app/modules/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nonhd-wallet-wizard',
  templateUrl: './nonhd-wallet-wizard.component.html',
})
export class NonhdWalletWizardComponent implements OnInit, OnDestroy {
  @Input() resetOnboarding: () => void;
  // Properties.
  loading = false;
  isSmallScreen = false;
  unlockFormGroup: FormGroup;
  passwordFormGroup: FormGroup;

  // View children.
  @ViewChild('stepper') stepper: MatStepper;

  // Observables and subjects.
  destroyed$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private walletService: WalletService,
    private authService: AuthenticationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.unlockFormGroup = this.formBuilder.group({
      keystoresPassword: ['', Validators.required]
    });
    const strongPasswordValidator = Validators.pattern(
      '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}',
    )
    this.passwordFormGroup = this.formBuilder.group({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        strongPasswordValidator,
      ]),
      passwordConfirmation: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        strongPasswordValidator,
      ]),
    }, {
      validators: this.passwordMatchValidator,
    });
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

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  createWallet(event: Event): void {
    event.stopPropagation();
    if (this.passwordFormGroup.invalid) {
      return;
    }
    const request: CreateWalletRequest = {
      keymanager: KeymanagerKind.Direct,
      walletPassword: this.passwordFormGroup.controls.password.value,
      numAccounts: 0,
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
            this.loading = false;
            return throwError(err);
          }),
        );
      })
    ).subscribe();
  }

  passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value;
    const confirmPassword: string = control.get('passwordConfirmation').value;
    if (password !== confirmPassword) {
      control.get('passwordConfirmation').setErrors({ passwordMismatch: true });
    }
  }
}