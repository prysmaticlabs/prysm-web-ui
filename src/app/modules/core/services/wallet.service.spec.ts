import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WalletService, GenerateMnemonicResponse } from './wallet.service';

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
    it('should properly retrieve a mnemonic and share replay', () => {
      const mockResponse: GenerateMnemonicResponse = {
        mnemonic: 'hello fish'
      };
      service.generateMnemonic$.subscribe(resp => {
        // Check the mnemonic in the response.
        expect(resp).toEqual(mockResponse.mnemonic);
      });
      const request = httpMock.expectOne( `/api/mnemonic/generate`);
      expect(request.request.method).toBe('GET');
      request.flush(mockResponse);
    });
  });
});