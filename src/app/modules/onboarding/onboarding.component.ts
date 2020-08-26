import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { tap, catchError, takeUntil } from 'rxjs/operators';

import { WalletKind, WalletSelection } from './types/wallet';
import { WalletService } from '../core/services/wallet.service';

export enum OnboardingState {
  PickingWallet = 'PickingWallet',
  HDWizard = 'HDWizard',
  NonHDWizard = 'NonHDWizard',
  RemoteWizard = 'RemoteWizard',
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
      name: 'HD Wallet',
      description: 'Secure kind of blockchain wallet which can be recovered from a 24-word mnemonic phrase',
      image: '/assets/images/onboarding/lock.svg',
    },
    {
      kind: WalletKind.Direct,
      name: 'Imported Wallet',
      description: '(Default) Simple wallet that allows to importing keys from an external source',
      image: '/assets/images/onboarding/direct.svg',
    },
    {
      kind: WalletKind.Remote,
      name: 'Remote Wallet',
      description: '(Advanced) Manages validator keys and sign requests via a remote server',
      image: '/assets/images/onboarding/server.svg',
      comingSoon: true,
    },
  ];

  // Define subjects for reacting to data changes.
  selectedWallet$ = new Subject<WalletKind>();
  // Keep track of a subject to immediately notify
  // all observables they should unsubscribe as soon
  // as this fires. This subject will fire in ngOnDestroy.
  destroyed$ = new Subject();

  constructor(
    private walletService: WalletService,
  ) { }

  ngOnInit(): void {
    // Get the wallet config.
    this.walletService.walletConfig$.pipe(
      tap((resp) => console.log(resp)),
      takeUntil(this.destroyed$),
      catchError(err => throwError(err)),
    ).subscribe();

    this.selectedWallet$.pipe(
      tap(kind => {
        switch (kind) {
          case WalletKind.Derived:
            this.onboardingState = OnboardingState.HDWizard;
            break;
          case WalletKind.Direct:
            this.onboardingState = OnboardingState.NonHDWizard;
            break;
          case WalletKind.Remote:
            this.onboardingState = OnboardingState.RemoteWizard;
            break;
          default:
            break;
        }
      }),
      takeUntil(this.destroyed$),
      catchError(err => throwError(err)),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
