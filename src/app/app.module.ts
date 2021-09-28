import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AuthModule } from './modules/auth/auth.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { SecurityModule } from './modules/security/security.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { SystemProcessModule } from './modules/system-process/system-process.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './modules/core/core.module';

const frameworkModules = [
  BrowserModule,
  BrowserAnimationsModule
];

const thirdPartyModules = [
  NgxSkeletonLoaderModule
];

const prysmModules = [
  CoreModule,
  AppRoutingModule,
  AuthModule,
  DashboardModule,
  WalletModule,
  OnboardingModule,
  SystemProcessModule,
  SecurityModule
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    ...frameworkModules,
    ...thirdPartyModules,
    ...prysmModules
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
