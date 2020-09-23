import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { AccountListComponent } from './components/account-list/account-list.component';
import { WalletConfigComponent } from './components/wallet-config/wallet-config.component';
import { WalletDetailsComponent } from './pages/wallet-details/wallet-details.component';

@NgModule({
  declarations: [AccountListComponent, WalletConfigComponent, WalletDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ]
})
export class WalletModule { }
