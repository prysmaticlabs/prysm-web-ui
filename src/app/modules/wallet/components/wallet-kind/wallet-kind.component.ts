import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { KeymanagerKind, KeymanagerKindToJSON } from 'src/app/proto/validator/accounts/v2/web_api';

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
  @Input() kind: KeymanagerKind = KeymanagerKind.UNRECOGNIZED;
  constructor() { }
  info: KeymanagerInfo = {
    DIRECT: {
      name: 'Imported Wallet',
      description: 'Hierarchical-deterministic (HD) wallets are secure blockchain wallets derived from a seed phrase (a 24 word mnemonic)',
      docsLink: 'https://docs.prylabs.network/docs/wallet/nondeterministic',
    },
    DERIVED: {
      name: 'HD Wallet',
      description: 'Hierarchical-deterministic (HD) wallets are secure blockchain wallets derived from a seed phrase (a 24 word mnemonic)',
      docsLink: 'https://docs.prylabs.network/docs/wallet/deterministic',
    },
    REMOTE: {
      name: 'Remote Signing Wallet',
      description: 'Hierarchical-deterministic (HD) wallets are secure blockchain wallets derived from a seed phrase (a 24 word mnemonic)',
      docsLink: 'https://docs.prylabs.network/docs/wallet/remote',
    },
    UNKNOWN: {
      name: 'Unknown',
      description: 'Could not determine your wallet kind',
      docsLink: 'https://docs.prylabs.network/docs/wallet/remote',
    }
  };

  parseKeymanagerKind(): string {
    return KeymanagerKindToJSON(this.kind);
  }
}
