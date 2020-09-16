import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorLogsStreamComponent } from './validator-logs-stream.component';

describe('ValidatorLogsStreamComponent', () => {
  let component: ValidatorLogsStreamComponent;
  let fixture: ComponentFixture<ValidatorLogsStreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidatorLogsStreamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorLogsStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
