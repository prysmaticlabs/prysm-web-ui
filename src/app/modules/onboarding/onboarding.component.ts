import { Component, OnInit, OnDestroy } from '@angular/core';
import { WalletKind, WalletSelection } from './types/wallet';
import { BehaviorSubject, Subscription } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

enum OnboardingState {
  PickingWallet = 'PickingWallet',
}

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
})
export class OnboardingComponent implements OnInit, OnDestroy {
  public States = OnboardingState; 
  onboardingState: OnboardingState = OnboardingState.PickingWallet;
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
  selectedWallet$ = new BehaviorSubject<WalletKind>(null);
  sub: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.sub = this.selectedWallet$.pipe(
      tap(kind => console.log(kind)),
      catchError(() => console.error),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
