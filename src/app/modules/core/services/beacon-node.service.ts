import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, interval, Observable } from 'rxjs';
import { tap, startWith, mergeMap, switchMap, filter, map, switchMapTo, catchError } from 'rxjs/operators';

import { EnvironmenterService } from './environmenter.service';
import { WalletService } from './wallet.service';

import {
  NodeConnectionResponse,
} from 'src/app/proto/validator/accounts/v2/web_api';

import {
  ValidatorBalances,
} from 'src/app/proto/eth/v1alpha1/beacon_chain';

import {
  SyncStatus,
} from 'src/app/proto/eth/v1alpha1/node';


const POLLING_INTERVAL = 3000;
const BEACON_API_SUFFIX = '/eth/v1alpha1';

export class BeaconNodeState {
  beaconNodeEndpoint$: BehaviorSubject<string> = new BehaviorSubject(undefined);
  connected$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  syncing$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  balances$: BehaviorSubject<ValidatorBalances> = new BehaviorSubject(undefined);
}

@Injectable({
  providedIn: 'root',
})
export class BeaconNodeService {
  constructor(
    private http: HttpClient,
    private environmenter: EnvironmenterService,
    private walletService: WalletService,
  ) { }

  private apiUrl = this.environmenter.env.validatorEndpoint;
  beaconNodeState: BeaconNodeState = new BeaconNodeState();

  private get getBeaconEndpoint$(): BehaviorSubject<string> {
    if (!this.beaconNodeState.beaconNodeEndpoint$.getValue()) {
      this.http.get<NodeConnectionResponse>(`${this.apiUrl}/health/node_connection`).subscribe(
          (res: NodeConnectionResponse) => {
          this.beaconNodeState.beaconNodeEndpoint$.next("http://" + res.beaconNodeEndpoint + BEACON_API_SUFFIX);
          },
          (error) => {
          }
        );
    }
    return this.beaconNodeState.beaconNodeEndpoint$;
  }

  private updateBalances(): void {
    this.getBeaconEndpoint$.pipe(
      filter((beacanNodeEndpoint) => {
        return beacanNodeEndpoint !== undefined;
      }),
      map(beacanNodeEndpoint => {
        return this.http.get<ValidatorBalances>(`${beacanNodeEndpoint}/validators/balances`)
          .subscribe((result) => {
            this.beaconNodeState.balances$.next(result)
            this.beaconNodeState.connected$.next(true);
          },
          (err) => {
            this.beaconNodeState.connected$.next(false);
          });
      })
    ).subscribe();
  }

  private updateSyncing(): void {
    this.getBeaconEndpoint$.pipe(
      filter((beacanNodeEnpoint) => {
        return beacanNodeEnpoint !== undefined;
      }),
      map(beacanNodeEnpoint => {
        return this.http.get<SyncStatus>(`${beacanNodeEnpoint}/eth/v1alpha1/node/syncing`)
          .subscribe((result) => {
            this.beaconNodeState.syncing$.next(result.syncing);
          },
            (err) => {
              this.beaconNodeState.syncing$.next(false);
            });
      })
    ).subscribe();
  }

  statusPoll$ = interval(POLLING_INTERVAL).pipe(
    startWith(0),
    tap(() => this.updateBalances())
  ).subscribe();
}
