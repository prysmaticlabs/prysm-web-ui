import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../shared/components/base.component';
import { Observable } from 'rxjs';
import { WalletService } from '../../../core/services/wallet.service';
import { map, filter } from 'rxjs/operators';
import {
  Account,
  AccountVoluntaryExitRequest,
} from '../../../../proto/validator/accounts/v2/web_api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilityValidator } from '../../../onboarding/validators/utility.validator';
import { ActivatedRoute } from '@angular/router';
import { base64ToHex } from 'src/app/modules/core/utils/hex-util';

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
    private formBuilder: FormBuilder
  ) {
    super();
  }
  exitAccountFormGroup: FormGroup | undefined | null;
  keys: Account[] = [];
  ngOnInit(): void {
    const publicKey = this.activatedRoute.snapshot.queryParams.publicKey;
    this.exitAccountFormGroup = this.formBuilder.group({
      confirmation: [
        '',
        [Validators.required, UtilityValidator.MustBe('agree')],
      ],
    });

    this.walletService
      .accounts()
      .pipe(map((x) => this.searchbyPublicKey(publicKey, x.accounts)))
      .subscribe((accs) => {
        accs.forEach((acc) => {
          this.keys.push(acc),
            this.exitAccountFormGroup?.addControl(
              acc.accountName,
              this.formBuilder.control({
                value: acc.accountName,
                disabled: true,
              })
            );
        });
      });
  }

  confirmation() {
    if (this.exitAccountFormGroup?.invalid) return false;
    const request = <AccountVoluntaryExitRequest>{
      publicKeys: this.keys.map((x) => x.validatingPublicKey),
      confrimation: this.exitAccountFormGroup?.get('confirmatio')?.value,
    };
    this.walletService.exitAccounts(request).subscribe((x) => this.back());
  }
  private searchbyPublicKey(publicKey: any, x: Account[]): Account[] {
    return publicKey
      ? x.filter((c) => base64ToHex(c.validatingPublicKey) == publicKey)
      : x;
  }
}
