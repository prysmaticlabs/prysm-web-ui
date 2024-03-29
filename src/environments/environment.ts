// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { IEnvironment } from './token';

export const environment: IEnvironment = {
  production: false,
  validatorEndpoint: 'http://127.0.0.1:7500/api/v2/validator',
  keymanagerEndpoint: 'http://127.0.0.1:7500/eth/v1',
  mockInterceptor: true
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
