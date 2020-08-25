import { Component, Input } from '@angular/core';
import { WalletKind, WalletSelection } from '../../types/wallet';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-choose-wallet-kind',
  templateUrl: './choose-wallet-kind.component.html',
})
export class ChooseWalletKindComponent {
  @Input() walletSelections: WalletSelection[];
  @Input() selectedWallet$: Subject<WalletKind>;
  selectedCard = 1; // We select card with index 1 as the default.
  constructor() { }

  // Update the currently selected UI card.
  selectCard(index: number): void {
    this.selectedCard = index;
  }
}
