import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MockService } from 'ng-mocks';
import { of } from 'rxjs';

import { ValidatorParticipationComponent } from './validator-participation.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ChainService } from 'src/app/modules/core/services/chain.service';
import { ValidatorParticipationResponse } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { ValidatorParticipation } from 'src/app/proto/eth/v1alpha1/validator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ValidatorParticipationComponent', () => {
  let component: ValidatorParticipationComponent;
  let fixture: ComponentFixture<ValidatorParticipationComponent>;
  const service: ChainService = MockService(ChainService);
  const defaultParticipationResponse = {
    epoch: 32,
    finalized: true,
    participation: {
      current_epoch_active_gwei: '1446418000000000' as any,
      current_epoch_attesting_gwei: '102777000000000' as any,
      current_epoch_target_attesting_gwei: '101552000000000' as any,
      eligible_ether: '1446290000000000' as any,
      global_participation_rate: 0.7861,
      previous_epoch_active_gwei: '1446290000000000' as any,
      previous_epoch_attesting_gwei: '1143101000000000' as any,
      previous_epoch_head_attesting_gwei: '1089546000000000' as any,
      previous_epoch_target_attesting_gwei: '1136975000000000' as any,
      voted_ether: '1136975000000000' as any,
    } as ValidatorParticipation,
  } as ValidatorParticipationResponse;
  (service as any)['participation$'] = of(defaultParticipationResponse);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidatorParticipationComponent ],
      imports: [
        SharedModule,
        BrowserAnimationsModule,
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
    const votedETH = (component as any).gweiToETH(defaultParticipationResponse?.participation?.voted_ether);
    const eligibleETH = (component as any).gweiToETH(defaultParticipationResponse?.participation?.eligible_ether);
    const elem: HTMLElement = fixture.nativeElement;
    expect(elem.textContent).toContain(votedETH);
    expect(elem.textContent).toContain(eligibleETH);
  });
});
