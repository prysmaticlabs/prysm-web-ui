import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgxFileDropModule } from 'ngx-file-drop';

import { SharedModule } from '../shared/shared.module';
import { OnboardingComponent } from './onboarding.component';
import { ChooseWalletKindComponent } from './components/choose-wallet-kind/choose-wallet-kind.component';
import { HdWalletWizardComponent } from './components/hd-wallet-wizard/hd-wallet-wizard.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChooseWalletPasswordComponent } from './components/choose-wallet-password/choose-wallet-password.component';
import { GenerateAccountsComponent } from './components/generate-accounts/generate-accounts.component';
import { GenerateMnemonicComponent } from './components/generate-mnemonic/generate-mnemonic.component';
import { ConfirmMnemonicComponent } from './components/confirm-mnemonic/confirm-mnemonic.component';
import { BlockCopyPasteDirective } from './directives/block-copy-paste.directive';
import { NonhdWalletWizardComponent } from './components/nonhd-wallet-wizard/nonhd-wallet-wizard.component';
import { ImportAccountsComponent } from './components/import-accounts/import-accounts.component';

@NgModule({
  declarations: [
    BlockCopyPasteDirective,
    OnboardingComponent,
    ChooseWalletKindComponent,
    HdWalletWizardComponent,
    ChooseWalletPasswordComponent,
    GenerateAccountsComponent,
    GenerateMnemonicComponent,
    ConfirmMnemonicComponent,
    NonhdWalletWizardComponent,
    ImportAccountsComponent,
  ],
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
