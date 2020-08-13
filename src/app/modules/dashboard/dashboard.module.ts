import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

import { NgxEchartsModule } from 'ngx-echarts';

import { SharedModule } from '../../modules/shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { GainsAndLossesComponent } from './pages/gains-and-losses/gains-and-losses.component';
import { AccountListCardComponent } from './components/account-list-card/account-list-card.component';
import { BalancesChartComponent } from './components/balances-chart/balances-chart.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    DashboardComponent, 
    GainsAndLossesComponent, 
    AccountListCardComponent, 
    BalancesChartComponent, 
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    MatTableModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    })
  ]
})
export class DashboardModule { }
