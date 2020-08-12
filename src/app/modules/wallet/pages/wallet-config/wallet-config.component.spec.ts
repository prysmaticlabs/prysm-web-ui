import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletConfigComponent } from './wallet-config.component';

describe('WalletConfigComponent', () => {
  let component: WalletConfigComponent;
  let fixture: ComponentFixture<WalletConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
