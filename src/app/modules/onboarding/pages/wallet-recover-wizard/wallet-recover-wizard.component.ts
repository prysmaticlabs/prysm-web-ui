import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,

  FormControl, FormGroup,

  Validators
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { LANDING_URL } from 'src/app/modules/core/constants';
import { ImportSlashingProtectionRequest, RecoverWalletRequest } from 'src/app/proto/validator/accounts/v2/web_api';
import { WalletService } from '../../../core/services/wallet.service';
import {
  StaticPasswordValidator
} from '../../../core/validators/password.validator';
import { BaseComponent } from '../../../shared/components/base.component';
import { MnemonicValidator } from '../../validators/mnemonic.validator';
import { UtilityValidator } from '../../validators/utility.validator';
import { MnemonicFormComponent } from './templates/mnemonic-form/mnemonic-form.component';

@Component({
  selector: 'app-wallet-recover-wizard',
  templateUrl: './wallet-recover-wizard.component.html',
  styleUrls: ['./wallet-recover-wizard.component.scss'],
})
export class WalletRecoverWizardComponent
  extends BaseComponent
  implements OnInit {
  @Output()
  backToWalletsRaised = new EventEmitter<void>();
  @ViewChild('stepper') stepper?: MatStepper;
  @ViewChild('mnemonicForm') mnemonicForm: MnemonicFormComponent | undefined;
  mnemonicFg!: FormGroup;
  passwordFG!: FormGroup;
  walletPasswordFg!: FormGroup;
  isSmallScreen = false;
  loading = false;
  constructor(
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private walletService: WalletService,
    private router: Router,
    private mnemonicValidator: MnemonicValidator
  ) {
    super();
    this.mnemonicFg = this.fb.group({
      mnemonic: [
        '',
        [Validators.required, this.mnemonicValidator.properFormatting],
      ],
      num_accounts: [1, [Validators.required, UtilityValidator.BiggerThanZero]],
      language: ['english', [Validators.required]],
    });
    this.passwordFG = this.fb.group(
      {
        password: new FormControl(
          '',

          [
            Validators.required,
            Validators.minLength(8),
          ]
        ),
        passwordConfirmation: new FormControl('', [
          Validators.required,
          Validators.minLength(8)
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
            Validators.minLength(8)
          ]
        ),
        passwordConfirmation: new FormControl('', [
          Validators.required,
          Validators.minLength(8)
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

  walletRecover(form: FormGroup): void {
    if (form.invalid) {
      return;
    }
    this.loading = true;
    const request = {
      mnemonic: this.mnemonicFg.get('mnemonic')?.value,
      num_accounts: this.mnemonicFg.get('num_accounts')?.value,
      wallet_password: form.get('password')?.value,
      language: this.mnemonicFg.get('language')?.value,
    } as RecoverWalletRequest;

    let recover$ =this.walletService.recover(request)
    // include slashing protection
    const slashingProtectionFile = this.mnemonicForm?.slashingProtectionFile;
    if(slashingProtectionFile ){
      const reqImportSlashing: ImportSlashingProtectionRequest = {
        slashingProtectionJson: JSON.stringify(slashingProtectionFile)
      }
      recover$ = recover$.pipe(switchMap(res=> this.walletService.importSlashingProtection(reqImportSlashing)));
    }

    recover$
      .pipe(
        tap(() => {
          this.loading = false;
        }),
        catchError(err => {
          this.loading = false;
          return throwError(err);
        })
      )
      .subscribe((x) => {
        this.router.navigate([LANDING_URL]);
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
