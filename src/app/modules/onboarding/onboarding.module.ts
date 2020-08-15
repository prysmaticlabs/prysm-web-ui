import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ChooseWalletComponent } from './pages/choose-wallet/choose-wallet.component';

@NgModule({
  declarations: [ChooseWalletComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
  ]
})
export class OnboardingModule { }
