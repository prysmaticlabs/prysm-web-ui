import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MockService } from 'ng-mocks';

import { ValidatorService, MAX_EPOCH_LOOKBACK } from './validator.service';
import { BeaconNodeService } from './beacon-node.service';
import { WalletService } from './wallet.service';
import { of } from 'rxjs';
import { ValidatorBalances, ValidatorBalances_Balance } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { hexToBase64 } from '../utils/hex-util';

describe('ValidatorService', () => {
  let service: ValidatorService;
  let beaconNodeService: BeaconNodeService = MockService(BeaconNodeService);
  let walletService: WalletService = MockService(WalletService);
  (beaconNodeService as any)['nodeEndpoint$'] = of('endpoint');
  (walletService as any)['validatingPublicKeys$'] = of([] as Uint8Array[]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        { provide: BeaconNodeService, useValue: beaconNodeService },
        { provide: WalletService, useValue: walletService },
      ]
    });
    service = TestBed.inject(ValidatorService);
    beaconNodeService = TestBed.inject(BeaconNodeService);
    walletService = TestBed.inject(WalletService);
    spyOn(service, 'balancesByEpoch').and.returnValue(of({
      epoch: 0,
      balances: [
        {
          publicKey: hexToBase64('0x1234'),
          balance: '31200823019',
        },
      ] as ValidatorBalances_Balance[],
    } as ValidatorBalances));
  });

  describe('recentEpochBalances', () => {
    it('should disallow lookback > MAX_EPOCH_LOOKBACK', () => {
      const badCall = () => {
        service.recentEpochBalances(0, MAX_EPOCH_LOOKBACK + 1);
      };
      expect(badCall).toThrowError();
    });

    it('should return an array of length lookback items', done => {
      service.recentEpochBalances(MAX_EPOCH_LOOKBACK + 5, MAX_EPOCH_LOOKBACK).subscribe((result: ValidatorBalances[]) => {
        expect(result).toBeTruthy();
        expect(result.length).toEqual(5);
        expect(result[0].epoch).toEqual(0);
        done();
      });
    });
  });

  describe('balancesByEpoch', () => {
    it('should properly encode a public key for URI inclusion', () => {
      const key = hexToBase64('0x1234');
      const encoded = (service as any).encodePublicKey(key);
      expect(decodeURIComponent(encoded)).toEqual(key.toString());
    });
  });
});
