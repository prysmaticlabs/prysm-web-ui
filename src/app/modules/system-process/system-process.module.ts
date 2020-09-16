import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxEchartsModule } from 'ngx-echarts';

import { SharedModule } from '../../modules/shared/shared.module';
import { LogsComponent } from './pages/logs/logs.component';
import { MetricsComponent } from './pages/metrics/metrics.component';
import { BalancesChartComponent } from './components/balances-chart/balances-chart.component';
import { ProposedMissedChartComponent } from './components/proposed-missed-chart/proposed-missed-chart.component';
import { DoubleBarChartComponent } from './components/double-bar-chart/double-bar-chart.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { ValidatorLogsStreamComponent } from './components/validator-logs-stream/validator-logs-stream.component';

@NgModule({
  declarations: [
    LogsComponent,
    MetricsComponent,
    BalancesChartComponent,
    ProposedMissedChartComponent,
    DoubleBarChartComponent,
    PieChartComponent,
    ValidatorLogsStreamComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    })
  ]
})
export class SystemProcessModule { }
