import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-import-accounts',
  templateUrl: './import-accounts.component.html',
})
export class ImportAccountsComponent {
  constructor(
    private fb: FormBuilder,
  ) { }
  importFormGroup = this.fb.group({
    keystoresImported: [
      [] as string[],
    ]
  });
}
