import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletHelpComponent } from './wallet-help.component';

describe('WalletHelpComponent', () => {
  let component: WalletHelpComponent;
  let fixture: ComponentFixture<WalletHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
