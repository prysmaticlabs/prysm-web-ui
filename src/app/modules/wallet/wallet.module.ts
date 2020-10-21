import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { WalletConfigComponent } from './components/wallet-config/wallet-config.component';
import { IconTriggerSelectComponent } from './components/icon-trigger-select/icon-trigger-select.component';
import { WalletDetailsComponent } from './pages/wallet-details/wallet-details.component';
import { WalletHelpComponent } from './components/wallet-help/wallet-help.component';
import { WalletKindComponent } from './components/wallet-kind/wallet-kind.component';
import { FilesAndDirectoriesComponent } from './components/files-and-directories/files-and-directories.component';
import { AccountsTableComponent } from './components/accounts-table/accounts-table.component';
import { AccountSelectionsComponent } from './components/account-selections/account-selections.component';
import { AccountActionsComponent } from './components/account-actions/account-actions.component';
import { CreateAccountComponent } from './pages/create-account/create-account.component';
import { ImportComponent } from './pages/import/import.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { DeleteSelectedAccountsComponent } from './components/delete-selected-accounts/delete-selected-accounts.component';

@NgModule({
  declarations: [
    AccountsComponent,
    WalletConfigComponent,
    IconTriggerSelectComponent,
    WalletDetailsComponent,
    WalletHelpComponent,
    WalletKindComponent,
    FilesAndDirectoriesComponent,
    AccountsTableComponent,
    AccountSelectionsComponent,
    AccountActionsComponent,
    CreateAccountComponent,
    ImportComponent,
    DeleteSelectedAccountsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    NgxFileDropModule
  ],
})
export class WalletModule { }
