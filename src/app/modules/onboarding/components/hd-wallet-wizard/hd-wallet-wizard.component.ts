import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-hd-wallet-wizard',
  templateUrl: './hd-wallet-wizard.component.html',
})
export class HdWalletWizardComponent implements OnInit {
  // Properties.
  isLinear = false;
  isSmallScreen = false;
  mnemonicFormGroup: FormGroup;
  accountsFormGroup: FormGroup;
  passwordFormGroup: FormGroup;

  // View children.
  @ViewChild('stepper') stepper: MatStepper;

  // Observables and subjects.
  destroyed$ = new Subject();

  constructor(
    private _formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.mnemonicFormGroup = this._formBuilder.group({
      mnemonic: new FormControl('', [
        Validators.required,
        Validators.pattern(
          `[a-zA-Z ]*`, // Only words separated by spaces.
        )
      ]),
    });
    this.accountsFormGroup = this._formBuilder.group({
      numAccounts: ['', Validators.required]
    });
    this.passwordFormGroup = this._formBuilder.group({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}',
        )
      ]),
      passwordConfirmation: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}',
        )
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

  passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value;
    const confirmPassword: string = control.get('passwordConfirmation').value;
    if (password !== confirmPassword) {
      control.get('passwordConfirmation').setErrors({ passwordMismatch: true });
    }
  }
}