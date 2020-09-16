import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgxFileDropModule } from 'ngx-file-drop';

import { SharedModule } from '../shared/shared.module';
import { OnboardingComponent } from './onboarding.component';
import { ChooseWalletKindComponent } from './components/choose-wallet-kind/choose-wallet-kind.component';
import { GenerateAccountsComponent } from './components/generate-accounts/generate-accounts.component';
import { GenerateMnemonicComponent } from './components/generate-mnemonic/generate-mnemonic.component';
import { ConfirmMnemonicComponent } from './components/confirm-mnemonic/confirm-mnemonic.component';
import { ImportAccountsComponent } from './components/import-accounts/import-accounts.component';
import { UnlockKeysComponent } from './components/unlock-keys/unlock-keys.component';

import { BlockCopyPasteDirective } from './directives/block-copy-paste.directive';
import { MnemonicValidator } from './validators/mnemonic.validator';

import { HdWalletWizardComponent } from './pages/hd-wallet-wizard/hd-wallet-wizard.component';
import { NonhdWalletWizardComponent } from './pages/nonhd-wallet-wizard/nonhd-wallet-wizard.component';

@NgModule({
  declarations: [
    BlockCopyPasteDirective,
    OnboardingComponent,
    ChooseWalletKindComponent,
    HdWalletWizardComponent,
    GenerateAccountsComponent,
    GenerateMnemonicComponent,
    ConfirmMnemonicComponent,
    NonhdWalletWizardComponent,
    ImportAccountsComponent,
    UnlockKeysComponent,
  ],
  providers: [MnemonicValidator],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NgxFileDropModule,
  ]
})
export class OnboardingModule { }
