import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAX_ACCOUNTS_CREATION } from 'src/app/modules/core/constants';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
})
export class CreateAccountComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
  ) { }
  maxAccounts = MAX_ACCOUNTS_CREATION;
  accountsFormGroup = this.fb.group({
    numAccounts: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.max(MAX_ACCOUNTS_CREATION),
    ]),
  });

  ngOnInit(): void {
  }
}
