import { Component } from '@angular/core';
import SidebarLink from './types/sidebar-link';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
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
          name: 'Performance metrics',
          icon: 'insert_chart',
          path: '/dashboard/system/metrics',
        },
        {
          name: 'System logs',
          icon: 'memory',
          path: '/dashboard/system/logs',
        },
      ],
    },
    {
      name: 'Security',
      icon: 'https',
      children: [
        {
          name: 'Change password',
          path: '/dashboard/security/change-password',
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
