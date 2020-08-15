import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseWalletComponent } from './choose-wallet.component';

describe('ChooseWalletComponent', () => {
  let component: ChooseWalletComponent;
  let fixture: ComponentFixture<ChooseWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
