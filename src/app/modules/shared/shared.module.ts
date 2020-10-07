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
import { Base64ToHexPipe } from './pipes/base64-to-hex.pipe';
import { OrdinalPipe } from './pipes/ordinal.pipe';
import { PrettyjsonPipe } from './pipes/pretty-json.pipe';
import { WalletPasswordFormComponent } from './components/wallet-password-form/wallet-password-form.component';
import { LoadingComponent } from './loading/loading.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ImportAccountsFormComponent } from './components/import-accounts-form/import-accounts-form.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { CreateAccountsFormComponent } from './components/create-accounts-form/create-accounts-form.component';
import { BreadcrumbService } from './services/breadcrumb.service';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { DepositDataComponent } from './components/deposit-data/deposit-data.component';
import { EpochPipe } from './pipes/format-epoch.pipe';
import { BalancePipe } from './pipes/balance.pipe';

@NgModule({
  declarations: [
    BreadcrumbComponent,
    Base64ToHexPipe,
    OrdinalPipe,
    PrettyjsonPipe,
    BalancePipe,
    EpochPipe,
    WalletPasswordFormComponent,
    LoadingComponent,
    ImportAccountsFormComponent,
    CreateAccountsFormComponent,
    DepositDataComponent,
  ],
  providers: [
    BreadcrumbService,
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
    AppRoutingModule,
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
    WalletPasswordFormComponent,
    LoadingComponent,
    NgxSkeletonLoaderModule,
    ClipboardModule,
    ImportAccountsFormComponent,
    CreateAccountsFormComponent,
    DepositDataComponent,
    EpochPipe,
    BalancePipe,
  ],
})
export class SharedModule { }
