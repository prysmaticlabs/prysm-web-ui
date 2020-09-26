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
    data: { 
      breadcrumb: 'Onboarding'
    },
    component: OnboardingComponent,
    canActivate: [AuthredirectGuard],
  },
  {
    path: 'login',
    data: { 
      breadcrumb: 'Login'
    },
    component: LoginComponent,
    canActivate: [NoWalletFoundGuard, AuthredirectGuard],
  },
  {
    path: 'dashboard',
    data: { 
      breadcrumb: 'Dashboard'
    },
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'gains-and-losses',
        data: { 
          breadcrumb: 'Gains & Losses'
        },
        component: GainsAndLossesComponent,
      },
      {
        path: 'wallet',
        data: { 
          breadcrumb: 'Wallet'
        },
        children: [
          {
            path: 'accounts',
            data: { 
              breadcrumb: 'Accounts'
            },
            component: AccountListComponent,
          },
          {
            path: 'details',
            data: { 
              breadcrumb: 'Details'
            },
            component: WalletDetailsComponent,
          },
        ]
      },
      {
        path: 'system',
        data: { 
          breadcrumb: 'System'
        },
        children: [
          {
            path: 'logs',
            data: { 
              breadcrumb: 'Logs'
            },
            component: LogsComponent,
          },
          {
            path: 'metrics',
            data: { 
              breadcrumb: 'Metrics'
            },
            component: MetricsComponent,
          },
        ]
      },
      {
        path: 'security',
        data: { 
          breadcrumb: 'Security'
        },
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
