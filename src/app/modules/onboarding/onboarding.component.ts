import { Component, OnInit, OnDestroy } from '@angular/core';
import { WalletKind, WalletSelection } from './types/wallet';
import { Subject, Subscription, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

enum OnboardingState {
  PickingWallet = 'PickingWallet',
  ConfirmingMnemonic = 'ConfirmingMnemonic',
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
      kind: WalletKind.Direct,
      name: 'Non-HD Wallet',
      description: '(Basic) Simple wallet that allows to importing keys from an external source',
      image: '/assets/images/onboarding/direct.svg',
    },
    {
      kind: WalletKind.Derived,
      name: 'HD Wallet',
      description: '(Default) Secure kind of blockchain wallet which can be recovered from a 24-word mnemonic phrase',
      image: '/assets/images/onboarding/lock.svg',
    },
    {
      kind: WalletKind.Remote,
      name: 'Remote Wallet',
      description: '(Advanced) Manages validator keys and sign requests via a remote server',
      image: '/assets/images/onboarding/server.svg',
    },
  ];
  // Wallet selection can be defined as a behavior subject.
  selectedWallet$ = new Subject<WalletKind>();
  sub: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.sub = this.selectedWallet$.pipe(
      tap(kind => {
        switch (kind) {
          case WalletKind.Derived:
            this.onboardingState = OnboardingState.ConfirmingMnemonic;
          default:
            console.log(kind);
        }
      }),
      catchError(err => throwError(err)),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
