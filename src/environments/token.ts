import { InjectionToken } from '@angular/core';

export interface IEnvironment {
    production: boolean;
    validatorEndpoint: string;
    keymanagerEndpoint: string;
    mockInterceptor?: boolean;
}

export const ENVIRONMENT = new InjectionToken<IEnvironment>('ENVIRONMENT');
