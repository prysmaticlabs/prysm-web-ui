import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-generate-accounts',
  templateUrl: './generate-accounts.component.html',
})
export class GenerateAccountsComponent {
  @Input() formGroup: FormGroup | null = null;
  constructor() { }
}
