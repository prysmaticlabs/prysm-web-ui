import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonhdWalletWizardComponent } from './nonhd-wallet-wizard.component';

describe('NonhdWalletWizardComponent', () => {
  let component: NonhdWalletWizardComponent;
  let fixture: ComponentFixture<NonhdWalletWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonhdWalletWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonhdWalletWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
