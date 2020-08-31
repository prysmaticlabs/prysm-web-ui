import { AuthResponse } from '../services/auth.service';
import {
  GenerateMnemonicResponse,
  WalletResponse,
} from '../services/wallet.service';

export const Mocks = {
  '/api/login': {
    token: 'mock.jwt.token',
  } as AuthResponse,
  '/api/signup': {
    token: 'mock.jwt.token',
  } as AuthResponse,
  '/api/wallet': {
    walletPath: '',
  } as WalletResponse,
  '/api/wallet/create': {
    walletPath: '/home/ubuntu',
  } as WalletResponse,
  '/api/mnemonic/generate': {
    mnemonic: 'grape harvest method public garden knife power era kingdom immense kitchen ethics walk gap thing rude split lazy siren mind vital fork deposit zebra',
  } as GenerateMnemonicResponse,
};
