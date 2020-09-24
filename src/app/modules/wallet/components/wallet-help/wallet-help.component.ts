import { Component } from '@angular/core';

interface HelpPanel {
  title: string;
  content: string;
}

@Component({
  selector: 'app-wallet-help',
  templateUrl: './wallet-help.component.html',
})
export class WalletHelpComponent {
  constructor() { }
  items: HelpPanel[] = [
    {
      title: 'How can I change my wallet password?',
      content: `
      You can easily change your wallet password by visiting our <a class="text-primary" href="/dashboard/gains-and-losses">change password page</a>
      `,
    },
    {
      title: 'How are my private keys stored?',
      content: `
      Private keys are encrypted using the EIP-2334 keystore standard for BLS-12381 private keys
      `,
    },
    {
      title: 'Is my wallet password stored?',
      content: 'We do not store your password, and only keep a strong hash of it using the popular bcrypt library as a standard for authentication',
    },
    {
      title: 'How can I recover my wallet?',
      content: 'Currently, you cannot recover an HD wallet from the web interface. If you wish to recover your wallet, you can use Prysm from the command line to accomplish this goal',
    },
  ];
}
