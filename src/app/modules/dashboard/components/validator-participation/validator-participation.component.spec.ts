import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MockService } from 'ng-mocks';
import { of } from 'rxjs';

import { ValidatorParticipationComponent } from './validator-participation.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ChainService } from 'src/app/modules/core/services/chain.service';
import { ValidatorParticipationResponse } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { ValidatorParticipation } from 'src/app/proto/eth/v1alpha1/validator';

describe('ValidatorParticipationComponent', () => {
  let component: ValidatorParticipationComponent;
  let fixture: ComponentFixture<ValidatorParticipationComponent>;
  let service: ChainService = MockService(ChainService);
  (service as any)['participation$'] = of({
    epoch: 0,
    participation: {
      globalParticipationRate: 0.95,
    } as ValidatorParticipation
  } as ValidatorParticipationResponse);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidatorParticipationComponent ],
      imports: [
        SharedModule,
      ],
      providers: [
        { provide: ChainService, useValue: service },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorParticipationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
