import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take, tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-hd-wallet-wizard',
  templateUrl: './hd-wallet-wizard.component.html',
})
export class HdWalletWizardComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  mnemonicFormGroup: FormGroup;
  accountsFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(
    private _formBuilder: FormBuilder,
    private _ngZone: NgZone,
  ) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.nullValidator]
    });
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
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(
      tap(() => this.autosize.resizeToFitContent(true)),
      take(1),
    ).subscribe();
  }
}