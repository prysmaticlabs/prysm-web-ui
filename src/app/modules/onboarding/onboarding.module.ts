import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { OnboardingComponent } from './onboarding.component';
import { ChooseWalletKindComponent } from './components/choose-wallet-kind/choose-wallet-kind.component';

@NgModule({
  declarations: [OnboardingComponent, ChooseWalletKindComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
  ]
})
export class OnboardingModule { }
