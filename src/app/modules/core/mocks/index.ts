import { AuthResponse } from '../services/auth.service';
import {
  GenerateMnemonicResponse,
  WalletResponse,
} from '../services/wallet.service';

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
