import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseWalletPasswordComponent } from './choose-wallet-password.component';

describe('ChooseWalletPasswordComponent', () => {
  let component: ChooseWalletPasswordComponent;
  let fixture: ComponentFixture<ChooseWalletPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseWalletPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseWalletPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
