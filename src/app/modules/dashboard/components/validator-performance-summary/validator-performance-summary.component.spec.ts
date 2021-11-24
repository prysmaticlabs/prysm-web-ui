import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ValidatorPerformanceSummaryComponent, PerformanceData } from './validator-performance-summary.component';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { ValidatorBalances, ValidatorSummaryResponse } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { BeaconNodeService } from 'src/app/modules/core/services/beacon-node.service';
import { Peers } from 'src/app/proto/eth/v1alpha1/node';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ValidatorPerformanceSummaryComponent', () => {
  let component: ValidatorPerformanceSummaryComponent;
  let fixture: ComponentFixture<ValidatorPerformanceSummaryComponent>;
  const service: ValidatorService = MockService(ValidatorService);
  const walletService: WalletService = MockService(WalletService);
  const beaconNodeService: BeaconNodeService = MockService(BeaconNodeService);

  let transformedData: PerformanceData;
  const defaultPerformanceData = {
    currentEffectiveBalances: ['31000000000', '31000000000'],
    correctlyVotedHead: [true, false],
    correctlyVotedSource: [true, false],
    correctlyVotedTarget: [true, true],
    averageActiveValidatorBalance: '32000000000',
    balancesBeforeEpochTransition: ['31000000000', '31000000000'],
    balancesAfterEpochTransition: ['32000000000', '32000000000'],
    epoch: '',
    balances: [{

      publicKey: '0xa2b5aaad9c6efefe7bb9b1243a043404f3362937cfb6b31833929833173f476630ea2cfeb0d9ddf15f97ca8685948820',


      index: 0,

      balance: '2000000000',

      status: ''
    }],
    nextPageToken: '',
    totalSize: 0,
    publicKeys: [],
    missingValidators: [],
  } as ValidatorSummaryResponse & ValidatorBalances;

  service['performance$'] = of(defaultPerformanceData);
  walletService['validatingPublicKeys$'] = of([] as string[]);
  (beaconNodeService as any)['peers$'] = of({
    peers: [],
  } as Peers);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidatorPerformanceSummaryComponent ],
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        MatTooltipModule,
      ],
      providers: [
        { provide: ValidatorService, useValue: service },
        { provide: BeaconNodeService, useValue: beaconNodeService },
        { provide: WalletService, useValue: walletService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorPerformanceSummaryComponent);
    component = fixture.componentInstance;
    component.loading = false;
    fixture.detectChanges();
    transformedData = (component as any).transformPerformanceData(defaultPerformanceData);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('transformPerformanceData', () => {
    it('should properly determine average effective balance', () => {
      expect(transformedData.totalBalance).toEqual('2.0');
    });
    it('should properly determine epoch gains', () => {
      expect(transformedData.recentEpochGains).toEqual('2.0');
    });
    it('should properly determine correctly voted head percent', () => {
      expect(transformedData.correctlyVotedHeadPercent).toEqual(50);
    });
  });
});
