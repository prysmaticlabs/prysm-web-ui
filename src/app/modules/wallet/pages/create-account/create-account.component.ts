import { Clipboard } from '@angular/cdk/clipboard';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { MAX_ACCOUNTS_CREATION } from 'src/app/modules/core/constants';
import { mockDepositDataJSON } from 'src/app/modules/core/mocks';
import { DepositDataResponse_DepositData } from 'src/app/proto/validator/accounts/v2/web_api';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
})
export class CreateAccountComponent {
  constructor(
    private fb: FormBuilder,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
  ) { }
  maxAccounts = MAX_ACCOUNTS_CREATION;
  accountsFormGroup = this.fb.group({
    numAccounts: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.max(MAX_ACCOUNTS_CREATION),
    ]),
  });
  depositData = mockDepositDataJSON;
  depositDataFileName = 'deposit_data-23920932.json';

  generateDownloadJSONUri(data: DepositDataResponse_DepositData[]): SafeUrl {
    const json = JSON.stringify(data);
    return this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(json));
  }

  copy(data: DepositDataResponse_DepositData[]): void {
    this.clipboard.copy(JSON.stringify(data));
    this.snackBar.open('Copied JSON string to clipboard', 'Close', {
      duration: 4000,
    });
  }
}
