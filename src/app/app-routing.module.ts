import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthredirectGuard } from './modules/core/guards/authredirect.guard';
import { AuthGuard } from './modules/core/guards/auth.guard';

import { LoginComponent } from './modules/auth/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { GainsAndLossesComponent } from './modules/dashboard/pages/gains-and-losses/gains-and-losses.component';
import { AccountListComponent } from './modules/wallet/pages/account-list/account-list.component';
import { WalletConfigComponent } from './modules/wallet/pages/wallet-config/wallet-config.component';
import { LogsComponent } from './modules/system-process/pages/logs/logs.component';
import { MetricsComponent } from './modules/system-process/pages/metrics/metrics.component';
import { ChangePasswordComponent } from './modules/security/pages/change-password/change-password.component';
import { OnboardingComponent } from './modules/onboarding/onboarding.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [AuthredirectGuard],
  },
  {
    path: 'onboarding',
    component: OnboardingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
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
            path: 'config',
            component: WalletConfigComponent,
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
