import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GlobalErrorHandler } from './services/global-error-handler';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ENVIRONMENT } from '../../../environments/token';
import { environment } from '../../../environments/environment';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { MockInterceptor } from './interceptors/mock.interceptor';

import { GlobalDialogComponent } from './components/global-dialog/global-dialog.component';

import { GlobalDialogService } from './components/global-dialog/global-dialog.service';
import { SharedModule } from '../shared/shared.module';

const components = [
    GlobalDialogComponent 
];

const commonProviders = [
    {
        // processes all errors
        provide: ErrorHandler,
        useClass: GlobalErrorHandler,
    },
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
    exports: [
        ...components
    ],
    providers: [
        ... commonProviders,
        ... environment.mockInterceptor ? mockProviders : []
    ],
  })
export class CoreModule {}
