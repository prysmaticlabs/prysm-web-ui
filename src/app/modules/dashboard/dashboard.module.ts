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

import { DashboardComponent } from './dashboard.component';
import { GainsAndLossesComponent } from './pages/gains-and-losses/gains-and-losses.component';
import { AccountListCardComponent } from './components/account-list-card/account-list-card.component';

@NgModule({
  declarations: [DashboardComponent, GainsAndLossesComponent, AccountListCardComponent],
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    MatTableModule,
  ]
})
export class DashboardModule { }
