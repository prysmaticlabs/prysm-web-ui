import { Component, OnInit } from '@angular/core';

interface walletSelection {
  kind: string;
  name: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-choose-wallet',
  templateUrl: './choose-wallet.component.html',
})
export class ChooseWalletComponent implements OnInit {
  selected: string = 'derived';
  onboardingState: string = 'pickingWallet';
  walletSelections: walletSelection[] = [
    {
      kind: 'direct',
      name: 'Non-HD Wallet',
      description: '(Basic) Simple wallet that allows to importing keys from an external source',
      image: '/assets/images/onboarding/direct.svg',
    },
    {
      kind: 'derived',
      name: 'HD Wallet',
      description: '(Default) Secure kind of blockchain wallet which can be recovered from a 24-word mnemonic phrase',
      image: '/assets/images/onboarding/lock.svg',
    },
    {
      kind: 'remote',
      name: 'Remote Wallet',
      description: '(Advanced) Manages validator keys and sign requests via a remote server',
      image: '/assets/images/onboarding/server.svg',
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  selectWallet(kind: string) {
    this.selected = kind;
  }

  next(state: string) {
    console.log(state);
    this.onboardingState = state;
  }
}
