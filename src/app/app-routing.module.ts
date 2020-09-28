import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthredirectGuard } from './modules/core/guards/authredirect.guard';
import { AuthGuard } from './modules/core/guards/auth.guard';
import { NoWalletFoundGuard } from './modules/core/guards/nowalletfound.guard';

import { LoginComponent } from './modules/auth/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { GainsAndLossesComponent } from './modules/dashboard/pages/gains-and-losses/gains-and-losses.component';
import { LogsComponent } from './modules/system-process/pages/logs/logs.component';
import { MetricsComponent } from './modules/system-process/pages/metrics/metrics.component';
import { ChangePasswordComponent } from './modules/security/pages/change-password/change-password.component';
import { OnboardingComponent } from './modules/onboarding/onboarding.component';
import { WalletDetailsComponent } from './modules/wallet/pages/wallet-details/wallet-details.component';
import { AccountListComponent } from './modules/wallet/pages/account-list/account-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'onboarding',
    component: OnboardingComponent,
    canActivate: [AuthredirectGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NoWalletFoundGuard, AuthredirectGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'gains-and-losses',
        component: GainsAndLossesComponent,
      },
      {
        path: 'wallet',
        children: [
          {
            path: 'accounts',
            component: AccountListComponent,
          },
          {
            path: 'details',
            component: WalletDetailsComponent,
          },
        ]
      },
      {
        path: 'system',
        children: [
          {
            path: 'logs',
            component: LogsComponent,
          },
          {
            path: 'metrics',
            component: MetricsComponent,
          },
        ]
      },
      {
        path: 'security',
        children: [
          {
            path: 'change-password',
            component: ChangePasswordComponent,
          },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
