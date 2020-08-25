import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { WalletKind } from './types/wallet';
import { OnboardingComponent, OnboardingState } from './onboarding.component';
import { ChooseWalletKindComponent } from './components/choose-wallet-kind/choose-wallet-kind.component';

describe('OnboardingComponent', () => {
  let component: OnboardingComponent;
  let fixture: ComponentFixture<OnboardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OnboardingComponent,
        MockComponent(ChooseWalletKindComponent),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should update onboarding state based on wallet selection', done => {
    component.selectedWallet$.subscribe(kind => {
      expect(component.onboardingState).toEqual(OnboardingState.NonHDWizard);
      done();
    });
    component.selectedWallet$.next(WalletKind.Direct);
  });
});
