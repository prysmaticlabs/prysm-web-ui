import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-hd-wallet-wizard',
  templateUrl: './hd-wallet-wizard.component.html',
})
export class HdWalletWizardComponent implements OnInit {
  isLinear = false;
  mnemonicFormGroup: FormGroup;
  accountsFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    private _formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
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
}