import { Component, OnInit, OnDestroy } from '@angular/core';
import { WalletKind, WalletSelection } from './types/wallet';
import { Subject, throwError } from 'rxjs';
import { tap, catchError, takeUntil } from 'rxjs/operators';

export enum OnboardingState {
  PickingWallet = 'PickingWallet',
  RecoverWizard = 'RecoverWizard',
  ImportWizard = 'ImportWizard',
}

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
})
export class OnboardingComponent implements OnInit, OnDestroy {
  // Alias the enum so we can access it via directives in the template.
  States = OnboardingState;
  // Keep track of the current state of the onboarding process.
  onboardingState: OnboardingState = OnboardingState.PickingWallet;
  // Wallet kinds for the user to choose from.
  walletSelections: WalletSelection[] = [
    {
      kind: WalletKind.Derived,
      name: 'Recover a Wallet',
      description:
        'Use a 24-word mnemonic phrase to recover existing validator keystores',
      image: '/assets/images/onboarding/lock.svg',
    },
    {
      kind: WalletKind.Imported,
      name: 'Import Keystores',
      description: 'Importing validator keystores from an external source',
      image: '/assets/images/onboarding/direct.svg',
    },
  ];

  // Define subjects for reacting to data changes.
  selectedWallet$ = new Subject<WalletKind>();
  // Keep track of a subject to immediately notify
  // all observables they should unsubscribe as soon
  // as this fires. This subject will fire in ngOnDestroy.
  destroyed$ = new Subject();

  constructor() {}

  ngOnInit(): void {
    this.selectedWallet$
      .pipe(
        tap((kind) => {
          switch (kind) {
            case WalletKind.Derived:
              this.onboardingState = OnboardingState.RecoverWizard;
              break;
            case WalletKind.Imported:
              this.onboardingState = OnboardingState.ImportWizard;
              break;
            default:
              break;
          }
        }),
        takeUntil(this.destroyed$),
        catchError((err) => throwError(err))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(undefined);
    this.destroyed$.complete();
  }

  resetOnboarding(): void {
    this.onboardingState = OnboardingState.PickingWallet;
  }
}
