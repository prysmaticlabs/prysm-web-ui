import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { MockService } from 'ng-mocks';

import { ActivationQueueComponent, QueueData } from './activation-queue.component';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { ValidatorQueue } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { SECONDS_PER_EPOCH } from 'src/app/modules/core/constants';
import { hexToBase64 } from 'src/app/modules/core/utils/hex-util';

describe('ActivationQueueComponent', () => {
  let component: ActivationQueueComponent;
  let fixture: ComponentFixture<ActivationQueueComponent>;
  let service: ValidatorService = MockService(ValidatorService);
  let walletService: WalletService = MockService(WalletService);
  const defaultQueueResponse = {
    churnLimit: 4,
    activationPublicKeys: [
      hexToBase64('0x123456'),
    ],
    activationValidatorIndices: [1],
    exitPublicKeys: [],
    exitValidatorIndices: [],
  } as ValidatorQueue;
  const defaultKeysResponse = [
    hexToBase64('0x123456'),
  ];
  service['activationQueue$'] = of(defaultQueueResponse);
  walletService['validatingPublicKeys$'] = of(defaultKeysResponse);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivationQueueComponent ],
      imports: [
        SharedModule,
      ],
      providers: [
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
        defaultQueueResponse.activationPublicKeys[0],
        hexToBase64('0x678')
      ];
      const key = defaultQueueResponse.activationPublicKeys[0];
      const position = component.positionInArray(arr, key);
      expect(position).toEqual(2);
    });
    it('should determine proper activation ETA in seconds if position < churn limit', () => {
      const data = {
        churnLimit: Array.from({ length: 4 })
      } as QueueData
      const estimatedTime = component.activationETAForPosition(0, data);
      expect(estimatedTime).toEqual(SECONDS_PER_EPOCH);
    });
    it('should determine proper activation ETA in seconds if position > churn limit', () => {
      const data = {
        churnLimit: Array.from({ length: 1 })
      } as QueueData
      const estimatedTime = component.activationETAForPosition(2, data);
      // Expect two epochs for activation if churn limit is 1.
      expect(estimatedTime).toEqual(SECONDS_PER_EPOCH*2);
    });
  });
});
