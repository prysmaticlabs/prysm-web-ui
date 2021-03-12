import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { GainsAndLossesComponent } from './modules/dashboard/pages/gains-and-losses/gains-and-losses.component';
import { LogsComponent } from './modules/system-process/pages/logs/logs.component';
import { MetricsComponent } from './modules/system-process/pages/metrics/metrics.component';
import { ChangePasswordComponent } from './modules/security/pages/change-password/change-password.component';
import { OnboardingComponent } from './modules/onboarding/onboarding.component';
import { WalletDetailsComponent } from './modules/wallet/pages/wallet-details/wallet-details.component';
import { AccountsComponent } from './modules/wallet/pages/accounts/accounts.component';
import { ImportComponent } from './modules/wallet/pages/import/import.component';
import { PeerLocationsMapComponent } from './modules/system-process/pages/peer-locations-map/peer-locations-map.component';
import { InitializeComponent } from './modules/auth/initialize/initialize.component';
import { Breadcrumb } from './modules/shared/services/breadcrumb.service';
import { AccountVoluntaryExitComponent } from './modules/wallet/pages/account-voluntary-exit/account-voluntary-exit.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'initialize',
    pathMatch: 'full',
  },
  {
    path: 'initialize',
    component: InitializeComponent,
  },
  {
    path: 'onboarding',
    data: {
      breadcrumb: 'Onboarding',
    },
    component: OnboardingComponent,
  },
  {
    path: 'dashboard',
    data: {
      breadcrumb: 'Dashboard',
    },
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'gains-and-losses',
        pathMatch: 'full',
      },
      {
        path: 'gains-and-losses',
        data: {
          breadcrumb: 'Gains & Losses',
        },
        component: GainsAndLossesComponent,
      },
      {
        path: 'wallet',
        data: {
          breadcrumb: 'Wallet',
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
            ],
          },
          {
            path: 'details',
            data: {
              breadcrumb: 'Wallet Details',
            },
            component: WalletDetailsComponent,
          },
          {
            path: 'accounts/voluntary-exit',
            data: {
              breadcrumb: 'Voluntary Exit',
            },
            component: AccountVoluntaryExitComponent,
          },
          {
            path: 'accounts/import',
            data: {
              breadcrumb: 'Import Accounts',
            },
            component: ImportComponent,
          },
        ],
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
              breadcrumb: 'Process Logs',
            },
            component: LogsComponent,
          },
          {
            path: 'metrics',
            data: {
              breadcrumb: 'Process Metrics',
            },
            component: MetricsComponent,
          },
          {
            path: 'peers-map',
            data: {
              breadcrumb: 'Peer locations map',
            },
            component: PeerLocationsMapComponent,
          },
        ],
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
              breadcrumb: 'Change Password',
            },
            component: ChangePasswordComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
