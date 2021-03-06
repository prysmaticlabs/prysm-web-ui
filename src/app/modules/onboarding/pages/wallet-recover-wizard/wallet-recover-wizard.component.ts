import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MnemonicValidator } from '../../validators/mnemonic.validator';
import { UtilityValidator } from '../../validators/utility.validator';
import { MatStepper } from '@angular/material/stepper';

import { AuthenticationService } from '../../../core/services/authentication.service';
import { WalletService } from '../../../core/services/wallet.service';
import { RecoverWalletRequest } from 'src/app/proto/validator/accounts/v2/web_api';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from '../../../shared/components/base.component';
import { StaticPasswordValidator } from '../../../core/validators/password.validator';

@Component({
  selector: 'app-wallet-recover-wizard',
  templateUrl: './wallet-recover-wizard.component.html',
  styleUrls: ['./wallet-recover-wizard.component.scss'],
})
export class WalletRecoverWizardComponent
  extends BaseComponent
  implements OnInit {
  @Output() backToWalletsRaised = new EventEmitter<void>();
  @ViewChild('horizontalStepper', { static: true }) stepper?: MatStepper;
  mnemonicFg!: FormGroup;
  passwordFG!: FormGroup;
  walletPasswordFg!: FormGroup;
  isSmallScreen = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private breakpointObserver: BreakpointObserver,
    private walletService: WalletService,
    private mnemonicValidator: MnemonicValidator
  ) {
    super();
    this.mnemonicFg = this.fb.group({
      mnemonic: [
        '',
        [Validators.required, this.mnemonicValidator.properFormatting],
        [this.mnemonicValidator.matchingMnemonic()],
      ],
      num_accounts: [1, [Validators.required, UtilityValidator.BiggerThanZero]],
    });
    this.passwordFG = this.fb.group(
      {
        password: new FormControl(
          '',

          [
            Validators.required,
            Validators.minLength(8),
            StaticPasswordValidator.strongPassword,
          ]
        ),
        passwordConfirmation: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          StaticPasswordValidator.strongPassword,
        ]),
      },
      {
        validators: StaticPasswordValidator.matchingPasswordConfirmation,
      }
    );
    this.walletPasswordFg = this.fb.group(
      {
        password: new FormControl(
          '',

          [
            Validators.required,
            Validators.minLength(8),
            StaticPasswordValidator.strongPassword,
          ]
        ),
        passwordConfirmation: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          StaticPasswordValidator.strongPassword,
        ]),
      },
      {
        validators: StaticPasswordValidator.matchingPasswordConfirmation,
      }
    );
  }

  ngOnInit(): void {
    this.registerBreakpointObserver();
  }

  onNext(
    st: MatStepper,
    oldForm: FormGroup,
    newForm: FormGroup
  ): void | FormGroup {
    oldForm = newForm;
    st?.next();
    return oldForm;
  }

  login(st: MatStepper, oldForm: FormGroup, newForm: FormGroup): void {
    this.authService.signup(newForm.value).subscribe((response) => {
      this.onNext(st, oldForm, newForm);
    });
  }

  walletRecover(form: FormGroup): void {
    if (form.invalid) {
      return;
    }
    const request = {
      mnemonic: this.mnemonicFg.get('mnemonic')?.value,
      num_accounts: this.mnemonicFg.get('num_accounts')?.value,
      wallet_password: form.get('password')?.value,
    } as RecoverWalletRequest;
    this.walletService.recover(request).subscribe((x) => {
      this.backToWalletsRaised.emit();
    });
  }

  registerBreakpointObserver(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(
        tap((result) => {
          this.isSmallScreen = result.matches;
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }
}
