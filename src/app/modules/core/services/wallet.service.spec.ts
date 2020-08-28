import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WalletService, CreateWalletRequest, GenerateMnemonicResponse, WalletResponse, KeymanagerKind } from './wallet.service';

describe('WalletService', () => {
  let service: WalletService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [WalletService]
    });
    service = TestBed.get(WalletService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Mnemonic generation', () => {
    it('should properly retrieve a mnemonic once and share replay', () => {
      const mockResponse: GenerateMnemonicResponse = {
        mnemonic: 'hello fish'
      };
      // We trigger two separate subscriptions and ensure only a single
      // http request is sent below. 
      service.generateMnemonic$.subscribe(resp => {
        // Check the mnemonic in the response.
        expect(resp).toEqual(mockResponse.mnemonic);
      });
      service.generateMnemonic$.subscribe(resp => {
        // Check the mnemonic in the response.
        expect(resp).toEqual(mockResponse.mnemonic);
      });
      const request = httpMock.expectOne('/api/mnemonic/generate');
      expect(request.request.method).toBe('GET');
      request.flush(mockResponse);
    });
  });


  describe('Wallet creation', () => {
    it('it should properly submit a POST request to create a wallet', () => {
      const mockResponse: WalletResponse = {
        walletPath: '/home/ubuntu/.eth2validators/prysm-wallet-v2',
      };
      const request: CreateWalletRequest = {
        keymanager: KeymanagerKind.Derived,
        walletPassword: 'password',
        numAccounts: 4,
      };
      // We trigger two separate subscriptions and ensure only a single
      // http request is sent below. 
      service.createWallet(request).subscribe(resp => {
        // Check the mnemonic in the response.
        expect(resp).toEqual(mockResponse);
      });
      const mockCall = httpMock.expectOne('/api/wallet/create');
      expect(mockCall.request.method).toBe('POST');
      mockCall.flush(mockResponse);
    });
  });
});