import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubleBarChartComponent } from './double-bar-chart.component';

describe('DoubleBarChartComponent', () => {
  let component: DoubleBarChartComponent;
  let fixture: ComponentFixture<DoubleBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoubleBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoubleBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
