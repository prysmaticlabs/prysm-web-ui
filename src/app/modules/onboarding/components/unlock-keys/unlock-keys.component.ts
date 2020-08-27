import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-unlock-keys',
  templateUrl: './unlock-keys.component.html',
})
export class UnlockKeysComponent implements OnInit {
  @Input() formGroup: FormGroup;
  constructor() { }

  ngOnInit(): void {
  }
}
