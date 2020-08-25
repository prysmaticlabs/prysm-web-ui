import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseWalletKindComponent } from './choose-wallet-kind.component';

describe('ChooseWalletKindComponent', () => {
  let component: ChooseWalletKindComponent;
  let fixture: ComponentFixture<ChooseWalletKindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseWalletKindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseWalletKindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
