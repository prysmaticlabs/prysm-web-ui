import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './modules/auth/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { GainsAndLossesComponent } from './modules/dashboard/pages/gains-and-losses/gains-and-losses.component';
import { AccountListComponent } from './modules/wallet/pages/account-list/account-list.component';
import { WalletConfigComponent } from './modules/wallet/pages/wallet-config/wallet-config.component';

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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
