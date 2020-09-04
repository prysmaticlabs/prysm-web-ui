import { AuthResponse, WalletResponse, GenerateMnemonicResponse } from 'src/app/proto/validator/accounts/v2/web_api';

export const Mocks = {
  '/api/validator/login': {
    token: 'mock.jwt.token',
  } as AuthResponse,
  '/api/validator/signup': {
    token: 'mock.jwt.token',
  } as AuthResponse,
  '/api/validator/wallet': {
    walletPath: '',
  } as WalletResponse,
  '/api/validator/wallet/create': {
    walletPath: '/home/ubuntu',
  } as WalletResponse,
  '/api/validator/mnemonic/generate': {
    mnemonic: 'grape harvest method public garden knife power era kingdom immense kitchen ethics walk gap thing rude split lazy siren mind vital fork deposit zebra',
  } as GenerateMnemonicResponse,
};
