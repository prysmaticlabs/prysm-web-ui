import { Component } from '@angular/core';
import { WalletService } from 'src/app/modules/core/services/wallet.service';

@Component({
  selector: 'app-account-actions',
  templateUrl: './account-actions.component.html',
  styles: [
  ]
})
export class AccountActionsComponent {
  constructor(
    private walletService: WalletService,
  ) { }
  walletConfig$ = this.walletService.walletConfig$;
}
