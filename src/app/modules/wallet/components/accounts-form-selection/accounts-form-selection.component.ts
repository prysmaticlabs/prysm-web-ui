import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { WalletService } from '../../../core/services/wallet.service';
import { Observable } from 'rxjs';
import { Account } from 'src/app/proto/validator/accounts/v2/web_api';
import {
  MatSelectionList,
  MatSelectionListChange,
} from '@angular/material/list';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-accounts-form-selection [formGroup]',
  templateUrl: './accounts-form-selection.component.html',
  styleUrls: ['./accounts-form-selection.component.scss'],
})
export class AccountsFormSelectionComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private walletService: WalletService
  ) {
    this.accounts$ = this.walletService.accounts().pipe(map((x) => x.accounts));
  }
  @Input() formGroup: FormGroup | undefined;
  @Input() publicKey: string | undefined;

  accounts$: Observable<Account[]>;
  toggledAll = new FormControl(false);
  ngOnInit(): void {
    if (this.publicKey) {
      this.accounts$ = this.accounts$.pipe(
        map((x) => this.searchbyPublicKey(this.publicKey, x))
      );
    }
  }

  toggleChange(selectionList: MatSelectionList, ev: MatCheckboxChange): void {
    if (ev.checked) {
      selectionList.selectAll();
      this.toggledAll.setValue(true);
      selectionList.selectedOptions.selected.forEach((x) => {
        if (this.formGroup && !this.formGroup?.get(x.value)) {
          this.formGroup.addControl(x.value, this.formBuilder.control(x.value));
        }
      });
    } else {
      selectionList.selectedOptions.selected.forEach((x) => {
        if (this.formGroup?.get(x.value)) {
          this.formGroup.removeControl(x.value);
        }
      });
      selectionList.deselectAll();
      this.toggledAll.setValue(false);
    }
  }

  selectionChange(ev: MatSelectionListChange): void {
    if (this.formGroup?.get(ev.options[0].value)) {
      this.formGroup.removeControl(ev.options[0].value);
    } else {
      this.formGroup?.addControl(
        ev.options[0].value,
        this.formBuilder.control(ev.options[0].value)
      );
    }
  }

  private searchbyPublicKey(publicKey: any, x: Account[]): Account[] {
    return publicKey
      ? x.filter((c) => c.validating_public_key === publicKey)
      : x;
  }
}
