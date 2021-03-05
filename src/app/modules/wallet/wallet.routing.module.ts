import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountVoluntaryExitComponent } from './pages/account-voluntary-exit/account-voluntary-exit.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { ImportComponent } from './pages/import/import.component';
import { WalletDetailsComponent } from './pages/wallet-details/wallet-details.component';
import { WalletComponent } from './wallet.component';

const routes: Routes = [
  {
    path: '',
    component: WalletComponent,
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
          {
            path: 'voluntary-exit',
            data: {
              breadcrumb: 'Voluntary Exit',
            },
            component: AccountVoluntaryExitComponent,
          },
          {
            path: 'import',
            data: {
              breadcrumb: 'Import Accounts',
            },
            component: ImportComponent,
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
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletRoutingModule {}
