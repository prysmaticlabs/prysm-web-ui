import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposedMissedChartComponent } from './proposed-missed-chart.component';

describe('ProposedMissedChartComponent', () => {
  let component: ProposedMissedChartComponent;
  let fixture: ComponentFixture<ProposedMissedChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposedMissedChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposedMissedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
