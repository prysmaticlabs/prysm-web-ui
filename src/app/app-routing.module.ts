import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthredirectGuard } from './modules/core/guards/authredirect.guard';
import { AuthGuard } from './modules/core/guards/auth.guard';

import { LoginComponent } from './modules/auth/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { GainsAndLossesComponent } from './modules/dashboard/pages/gains-and-losses/gains-and-losses.component';
import { LogsComponent } from './modules/system-process/pages/logs/logs.component';
import { MetricsComponent } from './modules/system-process/pages/metrics/metrics.component';
import { ChangePasswordComponent } from './modules/security/pages/change-password/change-password.component';
import { OnboardingComponent } from './modules/onboarding/onboarding.component';
import { WalletDetailsComponent } from './modules/wallet/pages/wallet-details/wallet-details.component';
import { AccountsComponent } from './modules/wallet/pages/accounts/accounts.component';
import { CreateAccountComponent } from './modules/wallet/pages/create-account/create-account.component';
import { ImportComponent } from './modules/wallet/pages/import/import.component';

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
    canActivate: [AuthredirectGuard],
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
        path: '',
        redirectTo: 'gains-and-losses',
        pathMatch: 'full',
      },
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
            path: '',
            redirectTo: 'accounts',
            pathMatch: 'full',
          },
          {
            path: 'accounts',
            data: {
              breadcrumb: 'Accounts',
            },
            children: [
              {
                path: '',
                component: AccountsComponent,
              },
              {
                path: 'create',
                component: CreateAccountComponent,
                data: {
                  breadcrumb: 'Create',
                }
              }
            ],
          },
          {
            path: 'details',
            data: {
              breadcrumb: 'Wallet Details'
            },
            component: WalletDetailsComponent,
          },
          {
            path: 'import',
            data: {
              breadcrumb: 'Import Accounts'
            },
            component: ImportComponent,
          },
        ]
      },
      {
        path: 'system',
        data: {
          breadcrumb: 'System',
        },
        children: [
          {
            path: '',
            redirectTo: 'logs',
            pathMatch: 'full',
          },
          {
            path: 'logs',
            data: {
              breadcrumb: 'Process Logs'
            },
            component: LogsComponent,
          },
          {
            path: 'metrics',
            data: {
              breadcrumb: 'Process Metrics'
            },
            component: MetricsComponent,
          },
        ]
      },
      {
        path: 'security',
        data: {
          breadcrumb: 'Security',
        },
        children: [
          {
            path: '',
            redirectTo: 'change-password',
            pathMatch: 'full',
          },
          {
            path: 'change-password',
            data: {
              breadcrumb: 'Change Password'
            },
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
