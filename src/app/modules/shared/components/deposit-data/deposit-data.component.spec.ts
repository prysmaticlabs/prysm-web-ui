import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositDataComponent } from './deposit-data.component';

describe('DepositDataComponent', () => {
  let component: DepositDataComponent;
  let fixture: ComponentFixture<DepositDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
