import { Component } from '@angular/core';
import SidebarLink from '../../types/sidebar-link';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  links: SidebarLink[] = [
    {
      name: 'Validator Gains & Losses',
      icon: 'trending_up',
      path: '/dashboard/gains-and-losses',
    },
    {
      name: 'Wallet & Accounts',
      icon: 'account_balance_wallet',
      children: [
        {
          name: 'Account list',
          icon: 'list',
          path: '/dashboard/wallet/accounts',
        },
        {
          name: 'Wallet configuration',
          path: '/dashboard/wallet/config',
          icon: 'settings_applications',
        },
      ],
    },
    {
      name: 'Process Analytics',
      icon: 'whatshot',
      children: [
        {
          name: 'System logs',
          icon: 'memory',
          path: '/dashboard/system/logs',
        },
        {
          name: 'Performance metrics',
          icon: 'insert_chart',
          path: '/dashboard/system/metrics',
        },
      ],
    },
    {
      name: 'Security',
      icon: 'https',
      children: [
        {
          name: 'Change password',
          path: '/forms/basic',
          icon: 'settings',
        },
      ],
    },
    {
      name: 'Read the Docs',
      icon: 'style',
      externalUrl: 'https://docs.prylabs.network'
    },
  ];
}
