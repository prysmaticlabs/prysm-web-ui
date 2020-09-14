import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorPerformanceSummaryComponent, PerformanceData } from './validator-performance-summary.component';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { ValidatorPerformanceResponse } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { BeaconNodeService } from 'src/app/modules/core/services/beacon-node.service';
import { Peers } from 'src/app/proto/eth/v1alpha1/node';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('ValidatorPerformanceSummaryComponent', () => {
  let component: ValidatorPerformanceSummaryComponent;
  let fixture: ComponentFixture<ValidatorPerformanceSummaryComponent>;
  let service: ValidatorService = MockService(ValidatorService);
  let walletService: WalletService = MockService(WalletService);
  let beaconNodeService: BeaconNodeService = MockService(BeaconNodeService);

  let transformedData: PerformanceData;
  const defaultPerformanceData = {
    currentEffectiveBalances: ['31000000000', '31000000000'],
    correctlyVotedHead: [true, false],
    correctlyVotedSource: [true, false],
    correctlyVotedTarget: [true, true],
    averageActiveValidatorBalance: '32000000000',
    inclusionDistances: ['2', '1'],
    balancesBeforeEpochTransition: ['31000000000', '31000000000'],
    balancesAfterEpochTransition: ['32000000000', '32000000000'],
  } as ValidatorPerformanceResponse;

  service['performance$'] = of(defaultPerformanceData);
  walletService['validatingPublicKeys$'] = of([] as string[]);
  (beaconNodeService as any)['peers$'] = of({
    peers: [],
  } as Peers);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidatorPerformanceSummaryComponent ],
      imports: [
        SharedModule,
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
    fixture.detectChanges();
    transformedData = (component as any).transformPerformanceData(defaultPerformanceData);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('transformPerformanceData', () => {
    it('should properly determine average effective balance', () => {
      expect(transformedData.averageEffectiveBalance).toEqual(31);
    });
    it('should properly determine average inclusion distance', () => {
      expect(transformedData.averageInclusionDistance).toEqual(1.5);
    });
    it('should properly determine epoch gains', () => {
      expect(transformedData.recentEpochGains).toEqual(2);
    });
    it('should properly determine correctly voted head percent', () => {
      expect(transformedData.correctlyVotedHeadPercent).toEqual(50);
    });
  });
});
