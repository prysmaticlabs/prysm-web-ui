import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from 'ng-mocks';
import { ChainService } from '../../../core/services/chain.service';
import { SharedModule } from '../../../shared/shared.module';
import {
  ValidatorPerformanceResponse,
} from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { ValidatorPerformanceListComponent } from './validator-performance-list.component';
import { Observable, of } from 'rxjs';

describe('ValidatorListComponent', () => {
  let component: ValidatorPerformanceListComponent;
  let fixture: ComponentFixture<ValidatorPerformanceListComponent>;
  let service: ChainService = MockService(ChainService);
  function validatorPerforamcne$(): Observable<ValidatorPerformanceResponse> {
    return of({
      currentEffectiveBalances: [],
      inclusionSlots: [],
      inclusionDistances: [],
      correctlyVotedSource: [],
      correctlyVotedTarget: [],
      correctlyVotedHead: [],
      balancesBeforeEpochTransition: [],
      balancesAfterEpochTransition: [],
      missingValidators: [],
      averageActiveValidatorBalance: 0,
      publicKeys: []
    } as ValidatorPerformanceResponse)
  }
  service.validatorPerforamcne$ = validatorPerforamcne$;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
      ],
      declarations: [ValidatorPerformanceListComponent],
      providers: [
        { provide: ChainService, useValue: service },
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
