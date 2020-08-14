import { InjectionToken } from '@angular/core';

export interface Environment {
    production: boolean,
    apiEndpoint: string,
}

export const ENVIRONMENT = new InjectionToken<Environment>('ENVIRONMENT');