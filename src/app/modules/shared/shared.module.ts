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
import { Base64ToHexPipe } from './pipes/base64-to-hex.pipe';
import { OrdinalPipe } from './pipes/ordinal.pipe';
import { LoadingComponent } from './loading/loading.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [
    BreadcrumbComponent,
    Base64ToHexPipe,
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
    Base64ToHexPipe,
    OrdinalPipe,
    LoadingComponent,
    NgxSkeletonLoaderModule
  ],
})
export class SharedModule { }
