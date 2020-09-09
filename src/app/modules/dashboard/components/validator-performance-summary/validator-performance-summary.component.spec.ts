import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorPerformanceSummaryComponent } from './validator-performance-summary.component';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { ValidatorPerformanceResponse } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { BeaconNodeService } from 'src/app/modules/core/services/beacon-node.service';
import { Peers } from 'src/app/proto/eth/v1alpha1/node';

describe('ValidatorPerformanceSummaryComponent', () => {
  let component: ValidatorPerformanceSummaryComponent;
  let fixture: ComponentFixture<ValidatorPerformanceSummaryComponent>;
  let service: ValidatorService = MockService(ValidatorService);
  let walletService: WalletService = MockService(WalletService);
  let beaconNodeService: BeaconNodeService = MockService(BeaconNodeService);
  (service as any)['performance$'] = of({
    averageActiveValidatorBalance: 32,
    balancesBeforeEpochTransition: [31, 31],
    balancesAfterEpochTransition: [32, 32],
    correctlyVotedHead: [true, false],
    correctlyVotedSource: [true, true],
    correctlyVotedTarget: [true, true],
    inclusionDistances: [2, 2],
  } as ValidatorPerformanceResponse);
  (walletService as any)['validatingPublicKeys$'] = of([] as Uint8Array[]);
  (beaconNodeService as any)['peers$'] = of({
    peers: [],
  } as Peers);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidatorPerformanceSummaryComponent ],
      imports: [
        SharedModule,
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
