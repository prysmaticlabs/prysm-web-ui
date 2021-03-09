import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgxFileDropModule } from 'ngx-file-drop';

import { SharedModule } from '../shared/shared.module';
import { OnboardingComponent } from './onboarding.component';
import { ChooseWalletKindComponent } from './components/choose-wallet-kind/choose-wallet-kind.component';
import { GenerateMnemonicComponent } from './components/generate-mnemonic/generate-mnemonic.component';
import { ConfirmMnemonicComponent } from './components/confirm-mnemonic/confirm-mnemonic.component';

import { BlockCopyPasteDirective } from './directives/block-copy-paste.directive';
import { MnemonicValidator } from './validators/mnemonic.validator';

import { HdWalletWizardComponent } from './pages/hd-wallet-wizard/hd-wallet-wizard.component';
import { NonhdWalletWizardComponent } from './pages/nonhd-wallet-wizard/nonhd-wallet-wizard.component';
import { WalletDirectoryFormComponent } from './components/wallet-directory-form/wallet-directory-form.component';
import { WalletRecoverWizardComponent } from './pages/wallet-recover-wizard/wallet-recover-wizard.component';
import { MnemonicFormComponent } from './pages/wallet-recover-wizard/templates/mnemonic-form/mnemonic-form.component';

@NgModule({
  declarations: [
    BlockCopyPasteDirective,
    OnboardingComponent,
    ChooseWalletKindComponent,
    HdWalletWizardComponent,
    GenerateMnemonicComponent,
    ConfirmMnemonicComponent,
    NonhdWalletWizardComponent,
    WalletDirectoryFormComponent,
    WalletRecoverWizardComponent,
    MnemonicFormComponent,
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
