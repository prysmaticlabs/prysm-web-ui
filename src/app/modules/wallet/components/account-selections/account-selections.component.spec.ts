import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSelectionsComponent } from './account-selections.component';

describe('AccountSelectionsComponent', () => {
  let component: AccountSelectionsComponent;
  let fixture: ComponentFixture<AccountSelectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSelectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSelectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
