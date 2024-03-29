import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgxEchartsModule } from 'ngx-echarts';

import { SharedModule } from '../../../shared/shared.module';
import { BalancesChartComponent } from '../../components/balances-chart/balances-chart.component';
import { ProposedMissedChartComponent } from '../../components/proposed-missed-chart/proposed-missed-chart.component';
import { DoubleBarChartComponent } from '../../components/double-bar-chart/double-bar-chart.component';
import { PieChartComponent } from '../../components/pie-chart/pie-chart.component';
import { MetricsComponent } from './metrics.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MetricsComponent', () => {
  let component: MetricsComponent;
  let fixture: ComponentFixture<MetricsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        NgxEchartsModule.forRoot({
          echarts: () => import('echarts'),
        })
      ],
      declarations: [
        BalancesChartComponent,
        ProposedMissedChartComponent,
        DoubleBarChartComponent,
        PieChartComponent,
        MetricsComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
