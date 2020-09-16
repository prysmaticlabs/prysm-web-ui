import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MockService } from 'ng-mocks';
import { of } from 'rxjs';

import { ValidatorParticipationComponent } from './validator-participation.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ChainService } from 'src/app/modules/core/services/chain.service';
import { ValidatorParticipationResponse } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { ValidatorParticipation } from 'src/app/proto/eth/v1alpha1/validator';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('ValidatorParticipationComponent', () => {
  let component: ValidatorParticipationComponent;
  let fixture: ComponentFixture<ValidatorParticipationComponent>;
  const service: ChainService = MockService(ChainService);
  const defaultParticipationResponse = {
    epoch: 32,
    finalized: true,
    participation: {
      currentEpochActiveGwei: '1446418000000000' as any,
      currentEpochAttestingGwei: '102777000000000' as any,
      currentEpochTargetAttestingGwei: '101552000000000' as any,
      eligibleEther: '1446290000000000' as any,
      globalParticipationRate: 0.7861,
      previousEpochActiveGwei: '1446290000000000' as any,
      previousEpochAttestingGwei: '1143101000000000' as any,
      previousEpochHeadAttestingGwei: '1089546000000000' as any,
      previousEpochTargetAttestingGwei: '1136975000000000' as any,
      votedEther: '1136975000000000' as any,
    } as ValidatorParticipation,
  } as ValidatorParticipationResponse;
  (service as any)['participation$'] = of(defaultParticipationResponse);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidatorParticipationComponent ],
      imports: [
        SharedModule,
        MatTooltipModule,
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

  it('should display the participation rate', () => {
    const elem: HTMLElement = fixture.nativeElement;
    expect(elem.textContent).toContain('78');
  });

  it('should display the epoch', () => {
    const elem: HTMLElement = fixture.nativeElement;
    expect(elem.textContent).toContain('32');
  });

  it('should display the voted eth vs. eligible eth', () => {
    const votedETH = (component as any).gweiToETH(defaultParticipationResponse?.participation?.votedEther);
    const eligibleETH = (component as any).gweiToETH(defaultParticipationResponse?.participation?.eligibleEther);
    const elem: HTMLElement = fixture.nativeElement;
    expect(elem.textContent).toContain(votedETH);
    expect(elem.textContent).toContain(eligibleETH);
  });
});
