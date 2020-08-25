import { Component, Input } from '@angular/core';
import { WalletKind, WalletSelection } from '../../types/wallet';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-choose-wallet-kind',
  templateUrl: './choose-wallet-kind.component.html',
})
export class ChooseWalletKindComponent {
  @Input() walletSelections: WalletSelection[];
  @Input() selectedWallet$: BehaviorSubject<WalletKind>;
  selectedCard = 1;
  constructor() { }

  selectCard(index: number) {
    this.selectedCard = index;
  }
}
