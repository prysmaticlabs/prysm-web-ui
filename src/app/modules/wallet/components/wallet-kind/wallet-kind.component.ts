import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

interface KeymanagerInfo {
  [key: string]: {
    name: string;
    description: string;
    docsLink: string;
  };
}

@Component({
  selector: 'app-wallet-kind',
  templateUrl: './wallet-kind.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletKindComponent {
  @Input() kind = 'UNKNOWN';
  constructor() { }
  info: KeymanagerInfo = {
    IMPORTED: {
      name: 'Imported Wallet',
      description: 'Imported (non-deterministic) wallets are the recommended wallets to use with Prysm when coming from the official eth2 launchpad',
      docsLink: 'https://docs.prylabs.network/docs/wallet/nondeterministic',
    },
    DERIVED: {
      name: 'HD Wallet',
      description: 'Hierarchical-deterministic (HD) wallets are secure blockchain wallets derived from a seed phrase (a 24 word mnemonic)',
      docsLink: 'https://docs.prylabs.network/docs/wallet/deterministic',
    },
    REMOTE: {
      name: 'Remote Signing Wallet',
      description: 'Remote wallets are the most secure, as they keep your private keys away from your validator',
      docsLink: 'https://docs.prylabs.network/docs/wallet/remote',
    },
    UNKNOWN: {
      name: 'Unknown',
      description: 'Could not determine your wallet kind',
      docsLink: 'https://docs.prylabs.network/docs/wallet/remote',
    }
  };
}
