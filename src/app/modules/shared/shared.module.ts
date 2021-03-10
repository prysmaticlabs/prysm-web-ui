import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {
  MatFormFieldModule,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field';
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
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MomentModule } from 'ngx-moment';

import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { PasswordFormComponent } from './components/password-form/password-form.component';
import { Base64ToHexPipe } from './pipes/base64-to-hex.pipe';
import { OrdinalPipe } from './pipes/ordinal.pipe';
import { PrettyjsonPipe } from './pipes/pretty-json.pipe';
import { LoadingComponent } from './loading/loading.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ImportAccountsFormComponent } from './components/import-accounts-form/import-accounts-form.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { BreadcrumbService } from './services/breadcrumb.service';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { EpochPipe } from './pipes/format-epoch.pipe';
import { SlotPipe } from './pipes/format-slot.pipe';
import { BalancePipe } from './pipes/balance.pipe';
import { CreateAccountsFormComponent } from './components/create-accounts-form/create-accounts-form.component';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    BreadcrumbComponent,
    Base64ToHexPipe,
    OrdinalPipe,
    PrettyjsonPipe,
    BalancePipe,
    EpochPipe,
    SlotPipe,
    PasswordFormComponent,
    LoadingComponent,
    ImportAccountsFormComponent,
    CreateAccountsFormComponent,
  ],
  providers: [
    BreadcrumbService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NgxFileDropModule,
    MatProgressBarModule,
  ],
  exports: [
    BreadcrumbComponent,
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
    MatSidenavModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTabsModule,
    MatExpansionModule,
    MatMenuModule,
    MatDialogModule,
    MomentModule,
    Base64ToHexPipe,
    OrdinalPipe,
    PrettyjsonPipe,
    PasswordFormComponent,
    LoadingComponent,
    NgxSkeletonLoaderModule,
    ClipboardModule,
    ImportAccountsFormComponent,
    EpochPipe,
    SlotPipe,
    BalancePipe,
    CreateAccountsFormComponent,
    MatListModule,
  ],
})
export class SharedModule {}
