import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { GainsAndLossesComponent } from './modules/dashboard/pages/gains-and-losses/gains-and-losses.component';
import { LogsComponent } from './modules/system-process/pages/logs/logs.component';
import { MetricsComponent } from './modules/system-process/pages/metrics/metrics.component';
import { ChangePasswordComponent } from './modules/security/pages/change-password/change-password.component';
import { OnboardingComponent } from './modules/onboarding/onboarding.component';
import { PeerLocationsMapComponent } from './modules/system-process/pages/peer-locations-map/peer-locations-map.component';
import { InitializeComponent } from './modules/auth/initialize/initialize.component';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { HasWalletGuard } from './modules/auth/guards/hasWallet.guard';
import { NotFoundComponent } from './modules/auth/error_pages/notfound.component';


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
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard, HasWalletGuard],
    component: OnboardingComponent,
  },
  {
    path: 'dashboard',
    data: {
      breadcrumb: 'Dashboard',
    },
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard, HasWalletGuard],
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
          breadcrumb: 'wallet',
        },
        loadChildren: () =>
          import('./modules/wallet/wallet.module').then((m) => m.WalletModule),
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
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
