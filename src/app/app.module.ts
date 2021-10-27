import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientXsrfModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AuthModule } from './modules/auth/auth.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { SystemProcessModule } from './modules/system-process/system-process.module';
import { CoreModule } from './modules/core/core.module';


const frameworkModules = [
  BrowserModule,
  BrowserAnimationsModule,
  HttpClientXsrfModule
];

const prysmModules = [
  CoreModule,
  AppRoutingModule,
  AuthModule,
  DashboardModule,
  WalletModule,
  OnboardingModule,
  SystemProcessModule
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    ...frameworkModules,
    ...prysmModules
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
