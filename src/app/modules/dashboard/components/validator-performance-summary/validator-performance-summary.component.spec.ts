import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorPerformanceSummaryComponent } from './validator-performance-summary.component';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { ValidatorPerformanceResponse } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { SharedModule } from 'src/app/modules/shared/shared.module';

describe('ValidatorPerformanceSummaryComponent', () => {
  let component: ValidatorPerformanceSummaryComponent;
  let fixture: ComponentFixture<ValidatorPerformanceSummaryComponent>;
  let service: ValidatorService = MockService(ValidatorService);
  (service as any)['performance$'] = of({
    averageActiveValidatorBalance: 32,
    balancesBeforeEpochTransition: [31, 31],
    balancesAfterEpochTransition: [32, 32],
    correctlyVotedHead: [true, false],
    correctlyVotedSource: [true, true],
    correctlyVotedTarget: [true, true],
    inclusionDistances: [2, 2],
  } as ValidatorPerformanceResponse);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidatorPerformanceSummaryComponent ],
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
    fixture = TestBed.createComponent(ValidatorPerformanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
