import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { of } from 'rxjs';
import { MockService } from 'ng-mocks';

import { ActivationQueueComponent, QueueData } from './activation-queue.component';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { ValidatorParticipationResponse, ValidatorQueue } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { SECONDS_PER_EPOCH } from 'src/app/modules/core/constants';
import { hexToBase64 } from 'src/app/modules/core/utils/hex-util';
import { ChainService } from 'src/app/modules/core/services/chain.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EnvironmenterService } from 'src/app/modules/core/services/environmenter.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ActivationQueueComponent', () => {
  let component: ActivationQueueComponent;
  let fixture: ComponentFixture<ActivationQueueComponent>;
  const envSpy = jasmine.createSpyObj('EnvironmenterService', ['env']);
  const service: ChainService = MockService(ChainService);
  const walletService: WalletService = MockService(WalletService);
  const defaultQueueResponse = {
    churn_limit: 4,
    activation_public_keys: [
      hexToBase64('0x123456'),
    ],
    activation_validator_indices: [1],
    exit_public_keys: [],
    exit_validator_indices: [],
  } as ValidatorQueue;
  const defaultKeysResponse = [
    hexToBase64('0x123456'),
  ];
  service['activationQueue$'] = of(defaultQueueResponse);
  service['participation$'] = of({} as ValidatorParticipationResponse);
  walletService['validatingPublicKeys$'] = of(defaultKeysResponse);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivationQueueComponent ],
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: EnvironmenterService, useValue: envSpy },
        { provide: ValidatorService, useValue: service },
        { provide: WalletService, useValue: walletService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivationQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Position in queue', () => {
    it('should determine position in activation array', () => {
      const arr = [
        hexToBase64('0x234'),
        defaultQueueResponse.activation_public_keys[0],
        hexToBase64('0x678')
      ];
      const key = defaultQueueResponse.activation_public_keys[0];
      const position = component.positionInArray(arr, key);
      expect(position).toEqual(2);
    });
    it('should determine proper activation ETA in seconds if position < churn limit', () => {
      const data = {
        churnLimit: Array.from({ length: 4 })
      } as QueueData;
      const estimatedTime = component.activationETAForPosition(0, data);
      expect(estimatedTime).toEqual(SECONDS_PER_EPOCH);
    });
    it('should determine proper activation ETA in seconds if position > churn limit', () => {
      const data = {
        churnLimit: Array.from({ length: 1 })
      } as QueueData;
      const estimatedTime = component.activationETAForPosition(2, data);
      // Expect two epochs for activation if churn limit is 1.
      expect(estimatedTime).toEqual(SECONDS_PER_EPOCH * 2);
    });
  });
});
