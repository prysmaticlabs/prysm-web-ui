import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountListCardComponent } from './account-list-card.component';

describe('AccountListCardComponent', () => {
  let component: AccountListCardComponent;
  let fixture: ComponentFixture<AccountListCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountListCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
