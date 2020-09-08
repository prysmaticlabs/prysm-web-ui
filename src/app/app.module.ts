import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { ErrorInterceptor } from './modules/core/interceptors/error.interceptor';
import { JwtInterceptor } from './modules/core/interceptors/jwt.interceptor';
import { ENVIRONMENT } from '../environments/token';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AuthModule } from './modules/auth/auth.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { SecurityModule } from './modules/security/security.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { SystemProcessModule } from './modules/system-process/system-process.module';
import { MockInterceptor } from './modules/core/interceptors/mock.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule,
    DashboardModule,
    WalletModule,
    OnboardingModule,
    SystemProcessModule,
    SecurityModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true },
    { provide: ENVIRONMENT, useValue: environment },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
