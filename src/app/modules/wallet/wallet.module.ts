import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { IconTriggerSelectComponent } from './components/icon-trigger-select/icon-trigger-select.component';
import { WalletDetailsComponent } from './pages/wallet-details/wallet-details.component';
import { WalletHelpComponent } from './components/wallet-help/wallet-help.component';
import { WalletKindComponent } from './components/wallet-kind/wallet-kind.component';
import { FilesAndDirectoriesComponent } from './components/files-and-directories/files-and-directories.component';
import { AccountsTableComponent } from './components/accounts-table/accounts-table.component';
import { AccountSelectionsComponent } from './components/account-selections/account-selections.component';
import { AccountActionsComponent } from './components/account-actions/account-actions.component';
import { ImportComponent } from './pages/import/import.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { AccountVoluntaryExitComponent } from './pages/account-voluntary-exit/account-voluntary-exit.component';
import { WalletRoutingModule } from './wallet.routing.module';
import { WalletComponent } from './wallet.component';
import { AccountDeleteComponent } from './pages/account-delete/account-delete.component';
import { AccountBackupComponent } from './pages/account-backup/account-backup.component';

@NgModule({
  declarations: [
    WalletComponent,
    AccountsComponent,
    IconTriggerSelectComponent,
    WalletDetailsComponent,
    WalletHelpComponent,
    WalletKindComponent,
    FilesAndDirectoriesComponent,
    AccountsTableComponent,
    AccountSelectionsComponent,
    AccountActionsComponent,
    ImportComponent,
    AccountVoluntaryExitComponent,
    AccountDeleteComponent,
    AccountBackupComponent,
  ],
  imports: [
    WalletRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxFileDropModule,
  ],
})
export class WalletModule {}
