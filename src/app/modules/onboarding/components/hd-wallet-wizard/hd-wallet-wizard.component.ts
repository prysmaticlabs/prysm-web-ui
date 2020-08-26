import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      mnemonic: ['', Validators.required]
    });
    this.accountsFormGroup = this._formBuilder.group({
      numAccounts: ['', Validators.required]
    });
    this.passwordFormGroup = this._formBuilder.group({
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required]
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
}