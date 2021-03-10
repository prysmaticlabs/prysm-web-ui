import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../shared/components/base.component';
import { WalletService } from '../../../core/services/wallet.service';
import { map } from 'rxjs/operators';
import {
  Account,
  AccountVoluntaryExitRequest,
} from '../../../../proto/validator/accounts/v2/web_api';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControlOptions,
} from '@angular/forms';
import { UtilityValidator } from '../../../onboarding/validators/utility.validator';
import { ActivatedRoute } from '@angular/router';
import { base64ToHex } from 'src/app/modules/core/utils/hex-util';
import { MatSelectionListChange } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-account-voluntary-exit',
  templateUrl: './account-voluntary-exit.component.html',
  styleUrls: ['./account-voluntary-exit.component.scss'],
})
export class AccountVoluntaryExitComponent
  extends BaseComponent
  implements OnInit {
  constructor(
    private walletService: WalletService,
    private activatedRoute: ActivatedRoute,
    private snackMsgService: MatSnackBar,
    private formBuilder: FormBuilder
  ) {
    super();
  }
  exitAccountFormGroup: FormGroup | undefined | null;
  keys: Account[] = [];
  ngOnInit(): void {
    const publicKey = this.activatedRoute.snapshot.queryParams.publicKey;
    this.exitAccountFormGroup = this.formBuilder.group(
      {
        confirmation: [
          '',
          [Validators.required, UtilityValidator.MustBe('agree')],
        ],
      },
      {
        validators: UtilityValidator.MustHaveMoreThanOneControl,
      } as AbstractControlOptions
    );

    this.walletService
      .accounts()
      .pipe(map((x) => this.searchbyPublicKey(publicKey, x.accounts)))
      .subscribe((accs) => {
        accs.forEach((acc) => {
          this.keys.push(acc);
        });
      });
  }

  selectionChange(ev: MatSelectionListChange): void {
    if (this.exitAccountFormGroup?.get(ev.options[0].value)) {
      this.exitAccountFormGroup.removeControl(ev.options[0].value);
    } else {
      this.exitAccountFormGroup?.addControl(
        ev.options[0].value,
        this.formBuilder.control(ev.options[0].value)
      );
    }
  }

  confirmation(): void | boolean {
    if (this.exitAccountFormGroup?.invalid) {
      return false;
    }
    const request = {
      publicKeys: this.keys.map((x) => x.validatingPublicKey),
    } as AccountVoluntaryExitRequest;

    this.walletService.exitAccounts(request).subscribe((x) => {
      const exitedKeys =
        Object.keys(this.exitAccountFormGroup?.controls ?? {}).length - 1;
      this.snackMsgService.open(
        `Successfully exited ${exitedKeys} key(s)`,
        'Success',
        {
          direction: 'rtl',
          politeness: 'assertive',
          duration: 4000,
        }
      );
      this.back();
    });
  }
  items = Array.from({length: 100000}).map((_, i) => `Item #${i}`);
  private searchbyPublicKey(publicKey: any, x: Account[]): Account[] {
    return publicKey
      ? x.filter((c) => base64ToHex(c.validatingPublicKey) === publicKey)
      : x;
  }
}
