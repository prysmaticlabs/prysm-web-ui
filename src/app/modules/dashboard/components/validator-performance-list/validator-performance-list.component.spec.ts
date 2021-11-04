import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from 'ng-mocks';
import { SharedModule } from '../../../shared/shared.module';
import {
  ValidatorBalances,
  ValidatorSummaryResponse,
} from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { ValidatorPerformanceListComponent } from './validator-performance-list.component';
import { of } from 'rxjs';
import { ValidatorService } from '../../../core/services/validator.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ValidatorListComponent', () => {
  let component: ValidatorPerformanceListComponent;
  let fixture: ComponentFixture<ValidatorPerformanceListComponent>;
  const service: ValidatorService = MockService(ValidatorService);
  service.performance$ = of({
      currentEffectiveBalances: [],
      inclusionSlots: [],
      inclusionDistances: [],
      correctlyVotedSource: [],
      correctlyVotedTarget: [],
      correctlyVotedHead: [],
      balancesBeforeEpochTransition: [],
      balancesAfterEpochTransition: [],
      missingValidators: [],
      averageActiveValidatorBalance: '',
      publicKeys: [],
      epoch: '',
      balances: [],
      nextPageToken: '',
      totalSize: 0,
    } as ValidatorSummaryResponse & ValidatorBalances);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        BrowserAnimationsModule
      ],
      declarations: [ValidatorPerformanceListComponent],
      providers: [
        { provide: ValidatorService, useValue: service },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorPerformanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
