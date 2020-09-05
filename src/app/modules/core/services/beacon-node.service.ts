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

export class BeaconState {
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
  beaconState: BeaconState = new BeaconState();

  private get getBeaconEndpoint$(): BehaviorSubject<string> {
    if (!this.beaconState.beaconNodeEndpoint$.getValue()) {
      this.http.get<NodeConnectionResponse>(`${this.apiUrl}/health/node_connection`).subscribe(
          (res: NodeConnectionResponse) => {
            this.beaconState.beaconNodeEndpoint$.next("http://" + res.beaconNodeEndpoint + BEACON_API_SUFFIX);
          },
          (error) => {
          }
        );
    }
    return this.beaconState.beaconNodeEndpoint$;
  }

  private updateBalances(): void {
    this.getBeaconEndpoint$.pipe(
      filter((beacanNodeEnpoint) => {
        return beacanNodeEnpoint !== undefined;
      }),
      map(beacanNodeEnpoint => {
        return this.http.get<ValidatorBalances>(`${beacanNodeEnpoint}/validators/balances`)
          .subscribe((result) => {
            this.beaconState.balances$.next(result)
            this.beaconState.connected$.next(true);
          },
          (err) => {
            this.beaconState.connected$.next(false);
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
            this.beaconState.syncing$.next(result.syncing);
          },
            (err) => {
              this.beaconState.syncing$.next(false);
            });
      })
    ).subscribe();
  }

  statusPoll$ = interval(POLLING_INTERVAL).pipe(
    startWith(0),
    tap(() => this.updateBalances()),
  ).subscribe();
}
