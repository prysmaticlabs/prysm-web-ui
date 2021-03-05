import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAX_ACCOUNTS_CREATION } from 'src/app/modules/core/constants';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../../../shared/components/base.component';

@Component({
  selector: 'app-mnemonic-form',
  templateUrl: './mnemonic-form.component.html',
  styleUrls: ['./mnemonic-form.component.scss'],
})
export class MnemonicFormComponent extends BaseComponent implements OnInit {
  @Input('fg') fg: FormGroup | null = null;
  @Output('onNext') onNext = new EventEmitter<FormGroup>();
  @Output('onBackToWalletsRaised')
  onBackToWalletsRaised = new EventEmitter<void>();
  constructor(private fb: FormBuilder) {
    super();
  }

  numAccountsFg = this.fb.group({
    numAccounts: [
      1,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(MAX_ACCOUNTS_CREATION),
      ],
    ],
  });
  ngOnInit(): void {
    this.numAccountsFg.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((val) => {
        if (this.fg) this.passValueToNum_Accounts(this.fg);
      });
  }
  next() {
    if (!this.fg) return;
    this.passValueToNum_Accounts(this.fg);
    this.onNext.emit(this.fg);
  }

  private passValueToNum_Accounts(fg: FormGroup) {
    fg.get('num_accounts')?.setValue(
      this.numAccountsFg.get('numAccounts')?.value
    );
  }
}
