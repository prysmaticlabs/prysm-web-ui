import { Component } from '@angular/core';

@Component({
  selector: 'app-wallet-config',
  templateUrl: './wallet-config.component.html',
})
export class WalletConfigComponent {
  constructor() {}

  config = {
    direct_eip_version: 'EIP-2335',
  };
}
