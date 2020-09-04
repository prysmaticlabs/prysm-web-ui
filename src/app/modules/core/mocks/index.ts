import { AuthResponse, WalletResponse, GenerateMnemonicResponse, NodeConnectionResponse } from 'src/app/proto/validator/accounts/v2/web_api';

export const Mocks = {
  '/v2/validator/login': {
    token: 'mock.jwt.token',
  } as AuthResponse,
  '/v2/validator/signup': {
    token: 'mock.jwt.token',
  } as AuthResponse,
  '/v2/validator/wallet': {
    walletPath: '/home/ubuntu',
  } as WalletResponse,
  '/v2/validator/wallet/create': {
    walletPath: '/home/ubuntu',
  } as WalletResponse,
  '/v2/validator/mnemonic/generate': {
    mnemonic: 'grape harvest method public garden knife power era kingdom immense kitchen ethics walk gap thing rude split lazy siren mind vital fork deposit zebra',
  } as GenerateMnemonicResponse,
  '/v2/validator/health/node_connection': {
    beaconNodeEndpoint: '127.0.0.1:3500',
    connected: true,
    syncing: true,
  } as NodeConnectionResponse,
};
