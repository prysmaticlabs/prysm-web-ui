import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { KeymanagerKind } from 'src/app/proto/validator/accounts/v2/web_api';

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
  Kinds = KeymanagerKind;
  walletConfig$ = this.walletService.walletConfig$;
}
