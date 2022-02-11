import { IEnvironment } from './token';

export const environment: IEnvironment = {
  production: false,
  validatorEndpoint: 'http://127.0.0.1:7500/api/v2/validator',
  keymanagerEndpoint: 'http://127.0.0.1:7500/eth/v1',
  mockInterceptor: false
};