import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { MomentModule } from 'ngx-moment';

import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { HexlifyPipe } from '../core/pipes/hexlify.pipe';
import { OrdinalPipe } from '../core/pipes/ordinal.pipe';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [
    BreadcrumbComponent,
    HexlifyPipe,
    OrdinalPipe,
    LoadingComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
  ],
  exports: [
    BreadcrumbComponent,
    BrowserAnimationsModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatGridListModule,
    MatCardModule,
    MatSnackBarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSortModule,
    MatStepperModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatDividerModule,
    MomentModule,
    HexlifyPipe,
    OrdinalPipe,
    LoadingComponent
  ],
})
export class SharedModule { }
