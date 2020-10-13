import { ChangeDetectionStrategy, Component } from '@angular/core';

interface HelpPanel {
  title: string;
  content: string;
}

@Component({
  selector: 'app-wallet-help',
  templateUrl: './wallet-help.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletHelpComponent {
  constructor() { }
  items: HelpPanel[] = [
    {
      title: 'How can I change my wallet password?',
      content: `
      You can easily change your wallet password by visiting our <a class="text-primary" href="/dashboard/security/change-password">change password page</a>
      `,
    },
    {
      title: 'How are my private keys stored?',
      content: `
      Private keys are encrypted using the <a class="text-primary" href="https://eips.ethereum.org/EIPS/eip-2335" target="_blank">EIP-2334 keystore standard</a> for BLS-12381 private keys, which is implemented by all eth2 client teams. <br/><br/>The internal representation Prysm uses, however, is quite different. For optimization purposes, we store a single EIP-2335 keystore called all-accounts.keystore.json which stores your private keys encrypted by a strong password. <br/><br/>This file is still compliant with EIP-2335.
      `,
    },
    {
      title: 'Is my wallet password stored?',
      content: 'We do not store your password, and only keep a strong hash of it using the popular <a class="text-primary" href="https://godoc.org/golang.org/x/crypto/bcrypt" target="_blank">bcrypt library</a> as a standard for authentication',
    },
    {
      title: 'How can I recover my wallet?',
      content: 'Currently, you cannot recover an HD wallet from the web interface. If you wish to recover your wallet, you can use Prysm from the command line to accomplish this goal. You can see our detailed documentation on recovering HD wallets <a class="text-primary" href="https://docs.prylabs.network/docs/wallet/deterministic#wallet-recovery" target="_blank">here</a>',
    },
  ];
}
