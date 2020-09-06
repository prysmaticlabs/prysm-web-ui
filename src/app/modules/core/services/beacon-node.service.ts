import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, interval, Observable } from 'rxjs';
import { tap, startWith, mergeMap, switchMap, take } from 'rxjs/operators';

import { Store } from 'src/app/modules/core/utils/simple-store';
import { select$ } from 'src/app/modules/core/utils/select$';
import { EnvironmenterService } from './environmenter.service';

import {
  NodeConnectionResponse,
} from 'src/app/proto/validator/accounts/v2/web_api';

import {
  ValidatorBalances,
} from 'src/app/proto/eth/v1alpha1/beacon_chain';


const POLLING_INTERVAL = 3000;
const BEACON_API_SUFFIX = '/eth/v1alpha1';

@Injectable({
  providedIn: 'root',
})
export class BeaconNodeService {
  constructor(
    private http: HttpClient,
    private environmenter: EnvironmenterService,
  ) { }

  private apiUrl = this.environmenter.env.validatorEndpoint;

  // Create a reliable, immutable store for storing the 
  // connection response with replayability.
  private beaconNodeState$ = new Store({} as NodeConnectionResponse);

  get beaconNodeEndpoint$(): Observable<string> {
    // Make sure we load the nodeStaus at least once if it was never called.
    if (!this.beaconNodeState$.getValue()) {
      this.nodeStatusPoll$.pipe(
        take(1)
      ).subscribe();
    }
    return select$(
      this.beaconNodeState$,
      res => "http://" + res.beaconNodeEndpoint + BEACON_API_SUFFIX,
    );
  }
  get beaconNodeConnected$(): Observable<boolean> {
    return select$(
      this.beaconNodeState$,
      res => res.connected,
    );
  }
  get beaconNodeSyncing$(): Observable<boolean> {
    return select$(
      this.beaconNodeState$,
      res => res.syncing,
    );
  }

  getBalances(): Observable<ValidatorBalances> {
    return this.beaconNodeEndpoint$.pipe(
      switchMap(beacanNodeEndpoint => {
        return this.http.get<ValidatorBalances>(`${beacanNodeEndpoint}/validators/balances`);
      })
    );
  }

  // Observables.
  nodeStatusPoll$ = interval(POLLING_INTERVAL).pipe(
    startWith(0),
    mergeMap(_ => this.http.get<NodeConnectionResponse>(`${this.apiUrl}/health/node_connection`)),
    tap((res: NodeConnectionResponse) => {
      this.beaconNodeState$.next(res);
    })
  );
}
