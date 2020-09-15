import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-wallet-config',
  templateUrl: './wallet-config.component.html',
})
export class WalletConfigComponent {
  constructor(private formBuilder: FormBuilder) {}

  isLinear = false;
  firstFormGroup = this.formBuilder.group({
    firstCtrl: ['', Validators.required]
  });
  secondFormGroup = this.formBuilder.group({
    secondCtrl: ['', Validators.required]
  });
}
