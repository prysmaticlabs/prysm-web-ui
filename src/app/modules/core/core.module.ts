import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ENVIRONMENT } from '../../../environments/token';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { MockInterceptor } from './interceptors/mock.interceptor';

import { GlobalDialogComponent } from './components/global-dialog/global-dialog.component';

import { GlobalDialogService } from './components/global-dialog/global-dialog.service';
import { SharedModule } from '../shared/shared.module';

const components = [
    GlobalDialogComponent
];

const commonProviders = [
    GlobalDialogService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: ENVIRONMENT, useValue: environment },
];

const mockProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true }
];

const prysmModules = [
    SharedModule
];

@NgModule({
    declarations: [
        ...components
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        ... prysmModules
    ],
    providers: [
        ... commonProviders,
        ... environment.mockInterceptor ? mockProviders : []
    ],
  })
export class CoreModule {}
