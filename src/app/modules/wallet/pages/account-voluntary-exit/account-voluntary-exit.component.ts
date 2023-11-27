import { Component, OnInit } from '@angular/core';
import {
  AbstractControlOptions, FormBuilder, FormControl, Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AccountVoluntaryExitRequest
} from '../../../../proto/validator/accounts/v2/web_api';
import { WalletService } from '../../../core/services/wallet.service';
import { UtilityValidator } from '../../../onboarding/validators/utility.validator';
import { BaseComponent } from '../../../shared/components/base.component';
import { NotificationService } from '../../../shared/services/notification.service';

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
    private notificationService: NotificationService,
    private formBuilder: FormBuilder
  ) {
    super();
  }
  exitAccountFormGroup = this.formBuilder.group(
    {
      confirmation: [
        '',
        [Validators.required, UtilityValidator.MustBe('agree')],
      ],
    },
    {
      validators: UtilityValidator.LengthMustBeBiggerThanOrEqual(2),
    } as AbstractControlOptions
  );

  toggledAll = new FormControl(false);
  publicKey: string | undefined;

  ngOnInit(): void {
    this.publicKey = this.activatedRoute.snapshot.queryParams.publicKey;
  }

  confirmation(): void | boolean {
    if (this.exitAccountFormGroup?.invalid) {
      return false;
    }
    const request = {
      public_keys: Object.keys(this.exitAccountFormGroup.value)
                  .filter((x) => x !== 'confirmation'),
    } as AccountVoluntaryExitRequest;
    
    this.walletService.exitAccounts(request).subscribe((x) => {
      const exitedKeys =
        Object.keys(this.exitAccountFormGroup?.controls ?? {}).length - 1;
      this.notificationService.notifySuccess(
        `Successfully exited ${exitedKeys} key(s)`
      );
      this.back();
    });
  }
}
