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
      content: 'hello world',
    },
    {
      title: 'How are my private keys stored?',
      content: 'hello world',
    },
    {
      title: 'Is my wallet password stored?',
      content: 'hello world',
    },
    {
      title: 'How can I recover my wallet?',
      content: 'hello world',
    },
  ];
}
