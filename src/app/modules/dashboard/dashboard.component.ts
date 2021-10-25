import { Component, OnDestroy, OnInit } from '@angular/core';
import SidebarLink from './types/sidebar-link';
import { BeaconNodeService } from '../core/services/beacon-node.service';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { LANDING_URL } from '../core/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(
    private beaconNodeService: BeaconNodeService,
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    router.events.pipe(takeUntil(this.destroyed$$)).subscribe((val) => {
      if (this.isSmallScreen) {
        this.isOpened = false;
      }
    });
  }
  links: SidebarLink[] = [
    {
      name: 'Validator Gains & Losses',
      icon: 'trending_up',
      path: '/' + LANDING_URL + '/gains-and-losses',
    },
    {
      name: 'Wallet & Accounts',
      icon: 'account_balance_wallet',
      children: [
        {
          name: 'Account List',
          icon: 'list',
          path: '/' + LANDING_URL + '/wallet/accounts',
        },
        {
          name: 'Wallet Information',
          path: '/' + LANDING_URL + '/wallet/details',
          icon: 'settings_applications',
        },
      ],
    },
    {
      name: 'Process Analytics',
      icon: 'whatshot',
      children: [
        {
          name: 'System Logs',
          icon: 'memory',
          path: '/' + LANDING_URL + '/system/logs',
        },
        {
          name: 'Peer Locations Map',
          icon: 'map',
          path: '/' + LANDING_URL + '/system/peers-map',
        },
      ],
    },
    {
      name: 'Read the Docs',
      icon: 'style',
      externalUrl: 'https://docs.prylabs.network',
    },
  ];

  isSmallScreen = false;
  isOpened = true;
  private destroyed$$ = new Subject<void>();

  ngOnInit(): void {
    this.beaconNodeService.nodeStatusPoll$
      .pipe(takeUntil(this.destroyed$$))
      .subscribe();
    this.registerBreakpointObserver();
  }

  ngOnDestroy(): void {
    this.destroyed$$.next();
    this.destroyed$$.complete();
  }

  openChanged(value: boolean): void {
    this.isOpened = value;
  }

  openNavigation(): void {
    this.isOpened = true;
  }

  registerBreakpointObserver(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(
        tap((result) => {
          this.isSmallScreen = result.matches;
          this.isOpened = !this.isSmallScreen;
        }),
        takeUntil(this.destroyed$$)
      )
      .subscribe();
  }
}
