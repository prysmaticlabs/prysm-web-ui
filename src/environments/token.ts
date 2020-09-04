import { InjectionToken } from '@angular/core';

export interface IEnvironment {
    production: boolean;
    validatorEndpoint: string;
}

export const ENVIRONMENT = new InjectionToken<IEnvironment>('ENVIRONMENT');