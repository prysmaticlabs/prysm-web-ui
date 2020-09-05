import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { AccountListComponent } from './pages/account-list/account-list.component';
import { WalletConfigComponent } from './pages/wallet-config/wallet-config.component';

@NgModule({
  declarations: [AccountListComponent, WalletConfigComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
  ]
})
export class WalletModule { }
