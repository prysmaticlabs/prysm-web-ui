import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
})
export class ImportComponent {
  constructor(
    private fb: FormBuilder,
  ) { }
  importFormGroup = this.fb.group({
    keystoresImported: [
      [] as string[],
    ]
  });
}
