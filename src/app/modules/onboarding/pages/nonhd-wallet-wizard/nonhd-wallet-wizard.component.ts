import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatStepper } from '@angular/material/stepper';

import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PasswordValidator } from 'src/app/modules/core/validators/password.validator';

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
  private passwordValidator = new PasswordValidator();

  // View children.
  @ViewChild('stepper') stepper: MatStepper;

  // Observables and subjects.
  destroyed$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
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
}