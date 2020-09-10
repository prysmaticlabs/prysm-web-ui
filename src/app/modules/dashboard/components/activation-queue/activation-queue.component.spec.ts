import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { MockService } from 'ng-mocks';

import { ActivationQueueComponent } from './activation-queue.component';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { ValidatorQueue } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { SharedModule } from 'src/app/modules/shared/shared.module';

describe('ActivationQueueComponent', () => {
  let component: ActivationQueueComponent;
  let fixture: ComponentFixture<ActivationQueueComponent>;
  let service: ValidatorService = MockService(ValidatorService);
  const defaultQueueResponse = {
    churnLimit: "4" as any,
    activationPublicKeys: [
      new Uint8Array([1, 2, 3]),
    ],
    activationValidatorIndices: [1],
    exitPublicKeys: [],
    exitValidatorIndices: [],
  } as ValidatorQueue
  service['activationQueue$'] = of(defaultQueueResponse);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivationQueueComponent ],
      imports: [
        SharedModule,
      ],
      providers: [
        { provide: ValidatorService, useValue: service },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivationQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
