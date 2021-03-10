import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgxEchartsModule } from 'ngx-echarts';

import { SharedModule } from '../../modules/shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { GainsAndLossesComponent } from './pages/gains-and-losses/gains-and-losses.component';
import { ValidatorPerformanceListComponent } from './components/validator-performance-list/validator-performance-list.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarExpandableLinkComponent } from './components/sidebar-expandable-link/sidebar-expandable-link.component';
import { BeaconNodeStatusComponent } from './components/beacon-node-status/beacon-node-status.component';
import { ValidatorParticipationComponent } from './components/validator-participation/validator-participation.component';
import { ValidatorPerformanceSummaryComponent } from './components/validator-performance-summary/validator-performance-summary.component';
import { ActivationQueueComponent } from './components/activation-queue/activation-queue.component';
import { VersionComponent } from './components/version/version.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    DashboardComponent,
    GainsAndLossesComponent,
    ValidatorPerformanceListComponent,
    SidebarComponent,
    SidebarExpandableLinkComponent,
    BeaconNodeStatusComponent,
    ValidatorParticipationComponent,
    ValidatorPerformanceSummaryComponent,
    ActivationQueueComponent,
    VersionComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    SharedModule,
    RouterModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    })
  ]
})
export class DashboardModule { }
