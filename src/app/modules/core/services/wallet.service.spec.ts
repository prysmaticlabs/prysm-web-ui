import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WalletService } from './wallet.service';
import {
  GenerateMnemonicResponse,
  WalletResponse,
  CreateWalletRequest,
  CreateWalletResponse
} from 'src/app/proto/validator/accounts/v2/web_api';
import { EnvironmenterService } from './environmenter.service';

describe('WalletService', () => {
  let service: WalletService;
  let environmenter: EnvironmenterService;
  let httpMock: HttpTestingController;
  const serviceSpy = jasmine.createSpyObj('EnvironmenterService', ['env']);

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          WalletService,
          { provide: EnvironmenterService, useValue: serviceSpy },
        ]
    });
    service = TestBed.inject(WalletService);
    environmenter = TestBed.inject(EnvironmenterService);
    httpMock = TestBed.inject(HttpTestingController);
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
      const request = httpMock.expectOne(`${environmenter.env.validatorEndpoint}/mnemonic/generate`);
      expect(request.request.method).toBe('GET');
      request.flush(mockResponse);
    });
  });


  describe('Wallet creation', () => {
    it('it should properly submit a POST request to create a wallet', () => {
      const mockResponse = {
        wallet: {
          walletPath: '/home/ubuntu/.eth2validators/prysm-wallet-v2',
        } as WalletResponse
      } as CreateWalletResponse;
      const request = {
        keymanager: 'DERIVED',
        walletPassword: 'password',
        numAccounts: 4,
      } as CreateWalletRequest;
      // We trigger two separate subscriptions and ensure only a single
      // http request is sent below.
      service.createWallet(request).subscribe(resp => {
        // Check the mnemonic in the response.
        expect(resp).toEqual(mockResponse);
      });
      const mockCall = httpMock.expectOne(`${environmenter.env.validatorEndpoint}/wallet/create`);
      expect(mockCall.request.method).toBe('POST');
      mockCall.flush(mockResponse);
    });
  });
});
