import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MockComponent } from 'ng-mocks';
import { NgxEchartsModule } from 'ngx-echarts';

import { GainsAndLossesComponent } from './gains-and-losses.component';
import { ValidatorPerformanceListComponent } from '../../components/validator-performance-list/validator-performance-list.component';
import { BalancesChartComponent } from '../../components/balances-chart/balances-chart.component';
import { SharedModule } from '../../../shared/shared.module';
import { BeaconNodeStatusComponent } from '../../components/beacon-node-status/beacon-node-status.component';
import { ValidatorPerformanceSummaryComponent } from '../../components/validator-performance-summary/validator-performance-summary.component';
import { ValidatorParticipationComponent } from '../../components/validator-participation/validator-participation.component';
import { ActivationQueueComponent } from '../../components/activation-queue/activation-queue.component';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { ChainService } from 'src/app/modules/core/services/chain.service';
import { ENVIRONMENT } from 'src/environments/token';

describe('GainsAndLossesComponent', () => {
  let component: GainsAndLossesComponent;
  let fixture: ComponentFixture<GainsAndLossesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientTestingModule,
        NgxEchartsModule.forRoot({
          echarts: () => import('echarts'),
        })
      ],
      declarations: [
        MockComponent(BeaconNodeStatusComponent),
        MockComponent(BalancesChartComponent),
        MockComponent(ValidatorPerformanceSummaryComponent),
        MockComponent(ValidatorParticipationComponent),
        MockComponent(ActivationQueueComponent),
        MockComponent(ValidatorPerformanceListComponent),
        GainsAndLossesComponent,
      ],
      providers: [
        {
          provider: ValidatorService,
          useValue: jasmine.createSpyObj('ValidatorService', ['recentEpochBalances']),
        },
        {
          provider: ChainService,
          useValue: jasmine.createSpyObj('ChainService', ['chainHead$']),
        },
        { provide: ENVIRONMENT, useValue: jasmine.createSpyObj('EnvironmenterService', ['env']) },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GainsAndLossesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
