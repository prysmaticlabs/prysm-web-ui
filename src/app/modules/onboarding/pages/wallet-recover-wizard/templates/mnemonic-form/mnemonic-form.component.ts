import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-mnemonic-form',
  templateUrl: './mnemonic-form.component.html',
  styleUrls: ['./mnemonic-form.component.scss'],
})
export class MnemonicFormComponent implements OnInit {
  @Input('fg') fg!: FormGroup;
  @Output('onNext') onNext = new EventEmitter<FormGroup>();
  @Output('onBackToWalletsRaised')
  onBackToWalletsRaised = new EventEmitter<void>();
  constructor() {}

  ngOnInit(): void {}
  next() {
    this.onNext.emit(this.fg);
  }
}
