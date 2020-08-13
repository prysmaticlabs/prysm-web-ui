import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalancesChartComponent } from './balances-chart.component';

describe('BalancesChartComponent', () => {
  let component: BalancesChartComponent;
  let fixture: ComponentFixture<BalancesChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalancesChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalancesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
