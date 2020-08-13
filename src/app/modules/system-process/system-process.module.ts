import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { NgxEchartsModule } from 'ngx-echarts';

import { SharedModule } from '../../modules/shared/shared.module';
import { LogsComponent } from './pages/logs/logs.component';
import { MetricsComponent } from './pages/metrics/metrics.component';
import { BalancesChartComponent } from './components/balances-chart/balances-chart.component';

@NgModule({
  declarations: [LogsComponent, MetricsComponent, BalancesChartComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    MatProgressBarModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    })
  ]
})
export class SystemProcessModule { }
