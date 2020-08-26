import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { WalletKind } from './types/wallet';
import { OnboardingComponent, OnboardingState } from './onboarding.component';
import { ChooseWalletKindComponent } from './components/choose-wallet-kind/choose-wallet-kind.component';
import { HdWalletWizardComponent } from './components/hd-wallet-wizard/hd-wallet-wizard.component';

describe('OnboardingComponent', () => {
  let component: OnboardingComponent;
  let fixture: ComponentFixture<OnboardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OnboardingComponent,
        MockComponent(ChooseWalletKindComponent),
        MockComponent(HdWalletWizardComponent),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingComponent);
    component = fixture.componentInstance;
    component.onboardingState = OnboardingState.PickingWallet;
    fixture.detectChanges();
  });

  it('should update onboarding state based on wallet selection', done => {
    expect(component.onboardingState).toEqual(OnboardingState.PickingWallet);
    component.selectedWallet$.subscribe(kind => {
      expect(component.onboardingState).toEqual(OnboardingState.NonHDWizard);
      done();
    });
    component.selectedWallet$.next(WalletKind.Direct);
  });
});
