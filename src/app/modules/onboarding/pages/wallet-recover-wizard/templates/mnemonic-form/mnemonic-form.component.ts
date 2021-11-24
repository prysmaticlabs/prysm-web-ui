import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../../../shared/components/base.component';
import { UtilityService } from '../../../../../shared/services/utility.service';
import { Observable } from 'rxjs';
import { ISelectListItem } from 'src/app/modules/shared/types/select-list-item';
import { ImportProtectionComponent } from 'src/app/modules/shared/components/import-protection/import-protection.component';

@Component({
  selector: 'app-mnemonic-form',
  templateUrl: './mnemonic-form.component.html',
  styleUrls: ['./mnemonic-form.component.scss'],
})
export class MnemonicFormComponent extends BaseComponent implements OnInit {
  @Input() fg: FormGroup | null = null;
  @Output() nextRaised = new EventEmitter<FormGroup>();
  @Output()
  backToWalletsRaised = new EventEmitter<void>();
  @ViewChild('slashingProtection') slashingProtection: ImportProtectionComponent | undefined;
  constructor(private fb: FormBuilder, utilityService: UtilityService) {
    super();
    this.languages$ = utilityService.languages$();
  }

  

  languages$: Observable<ISelectListItem[]>;

  numAccountsFg = this.fb.group({
    numAccounts: [
      1,
      [
        Validators.required,
        Validators.min(1)
      ],
    ],
  });
  ngOnInit(): void {
    this.numAccountsFg.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((val) => {
        if (this.fg) {
          this.passValueToNum_Accounts(this.fg);
        }
      });
  }

  get slashingProtectionFile(){
    return this.slashingProtection?.importedFiles[0];
  }


  next(): void {
    if (!this.fg || this.slashingProtection?.invalid) {
      return;
    }
    this.passValueToNum_Accounts(this.fg);
    this.nextRaised.emit(this.fg);
  }

  private passValueToNum_Accounts(fg: FormGroup): void {
    fg.get('num_accounts')?.setValue(
      this.numAccountsFg.get('numAccounts')?.value
    );
  }
}
