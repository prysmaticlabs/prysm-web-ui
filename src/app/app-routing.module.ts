import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { GainsAndLossesComponent } from './modules/dashboard/pages/gains-and-losses/gains-and-losses.component';
import { LogsComponent } from './modules/system-process/pages/logs/logs.component';
import { MetricsComponent } from './modules/system-process/pages/metrics/metrics.component';
import { OnboardingComponent } from './modules/onboarding/onboarding.component';
import { PeerLocationsMapComponent } from './modules/system-process/pages/peer-locations-map/peer-locations-map.component';
import { InitializeComponent } from './modules/auth/initialize/initialize.component';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { HasWalletGuard } from './modules/auth/guards/hasWallet.guard';
import { NotFoundComponent } from './modules/auth/error_pages/notfound.component';

import { LANDING_URL } from './modules/core/constants';
import { ONBOARDING_URL } from './modules/core/constants';

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
    path: ONBOARDING_URL,
    data: {
      breadcrumb: ONBOARDING_URL,
    },
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard, HasWalletGuard],
    component: OnboardingComponent,
  },
  {
    path: LANDING_URL,
    data: {
      breadcrumb: LANDING_URL,
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
    ],
  },
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
