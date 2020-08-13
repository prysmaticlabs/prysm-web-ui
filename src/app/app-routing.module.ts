import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './modules/auth/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { GainsAndLossesComponent } from './modules/dashboard/pages/gains-and-losses/gains-and-losses.component';
import { AccountListComponent } from './modules/wallet/pages/account-list/account-list.component';
import { WalletConfigComponent } from './modules/wallet/pages/wallet-config/wallet-config.component';
import { LogsComponent } from './modules/system-process/pages/logs/logs.component';
import { MetricsComponent } from './modules/system-process/pages/metrics/metrics.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
