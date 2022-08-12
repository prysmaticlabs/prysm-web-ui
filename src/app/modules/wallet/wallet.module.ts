import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { WalletRoutingModule } from './wallet.routing.module';

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
import { AccountVoluntaryExitComponent } from './pages/account-voluntary-exit/account-voluntary-exit.component';
import { AccountDeleteComponent } from './components/account-delete/account-delete.component';
import { WalletComponent } from './wallet.component';
import { AccountsFormSelectionComponent } from './components/accounts-form-selection/accounts-form-selection.component';
import { AccountBackupComponent } from './pages/account-backup/account-backup.component';
import { EditFeeRecipientComponent } from './components/fee-recipient/fee-recipient-edit.component';
import { EditGasLimitComponent } from './components/gas-limit/gas-limit-edit.component';

@NgModule({
  declarations: [
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
    WalletComponent,
    AccountBackupComponent,
    AccountsFormSelectionComponent,
    EditFeeRecipientComponent,
    EditGasLimitComponent
  ],
  imports: [
    CommonModule,
    WalletRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ],
})
export class WalletModule {}
