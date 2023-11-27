import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MockComponent } from 'ng-mocks';
import { NgxEchartsModule } from 'ngx-echarts';

import { GainsAndLossesComponent } from './gains-and-losses.component';
import { ValidatorPerformanceListComponent } from '../../components/validator-performance-list/validator-performance-list.component';
import { SharedModule } from '../../../shared/shared.module';
import { BeaconNodeStatusComponent } from '../../components/beacon-node-status/beacon-node-status.component';
import { ValidatorPerformanceSummaryComponent } from '../../components/validator-performance-summary/validator-performance-summary.component';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { ENVIRONMENT } from 'src/environments/token';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('GainsAndLossesComponent', () => {
  let component: GainsAndLossesComponent;
  let fixture: ComponentFixture<GainsAndLossesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        NgxEchartsModule.forRoot({
          echarts: () => import('echarts'),
        })
      ],
      declarations: [
        MockComponent(BeaconNodeStatusComponent),
        MockComponent(ValidatorPerformanceSummaryComponent),
        MockComponent(ValidatorPerformanceListComponent),
        GainsAndLossesComponent,
      ],
      providers: [
        {
          provider: ValidatorService,
          useValue: jasmine.createSpyObj('ValidatorService', ['recentEpochBalances']),
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
