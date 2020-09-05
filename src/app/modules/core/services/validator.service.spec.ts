import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MockService } from 'ng-mocks';

import { ValidatorService } from './validator.service';
import { BeaconNodeService } from './beacon-node.service';
import { WalletService } from './wallet.service';

describe('ValidatorService', () => {
  let service: ValidatorService;
  let beaconNodeService: BeaconNodeService = MockService(BeaconNodeService);
  let walletService: WalletService = MockService(WalletService);

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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
