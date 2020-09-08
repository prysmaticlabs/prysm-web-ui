import { Component, OnInit } from '@angular/core';
import SidebarLink from './types/sidebar-link';
import { BeaconNodeService } from '../core/services/beacon-node.service';
import { ChainService } from '../core/services/chain.service';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  constructor(
    private beaconNodeService: BeaconNodeService,
    private chainService: ChainService,
  ) { }
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

  destroyed$$ = new Subject<void>();
  
  ngOnInit(): void {
    this.beaconNodeService.nodeStatusPoll$.pipe(
      takeUntil(this.destroyed$$),
    ).subscribe();
    this.chainService.participation$.pipe(
      tap((res) => console.log(res)),
      takeUntil(this.destroyed$$),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$$.next();
    this.destroyed$$.complete();
  }
}
