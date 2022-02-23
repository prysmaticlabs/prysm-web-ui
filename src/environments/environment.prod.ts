import { IEnvironment } from './token';

// please update this configuration if api version upgrades
export const environment: IEnvironment = {
  production: true,
  validatorEndpoint: '/api/v2/validator',
  keymanagerEndpoint: '/eth/v1/keystores',
};
