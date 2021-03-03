import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletRecoverWizardComponent } from './wallet-recover-wizard.component';

describe('WalletRecoverWizardComponent', () => {
  let component: WalletRecoverWizardComponent;
  let fixture: ComponentFixture<WalletRecoverWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletRecoverWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletRecoverWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
