import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-unlock-keys',
  templateUrl: './unlock-keys.component.html',
})
export class UnlockKeysComponent {
  @Input() formGroup: FormGroup | null = null;
  constructor() { }
}
