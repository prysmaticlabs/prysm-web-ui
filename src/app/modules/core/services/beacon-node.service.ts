import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { interval, Observable } from 'rxjs';
import { tap, startWith, mergeMap, take, switchMap } from 'rxjs/operators';

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
  ) {
    this.nodeStatus$.pipe(
      take(1),
      tap((res: NodeConnectionResponse) => {
        this.beaconNodeState$.next(res);
      })
    ).subscribe()
  }

  private apiUrl = this.environmenter.env.validatorEndpoint;

  // Create a reliable, immutable store for storing the 
  // connection response with replayability.
  private beaconNodeState$ = new Store({} as NodeConnectionResponse);
  readonly beaconNodeEndpoint$ = select$(
    this.beaconNodeState$,
    (res: NodeConnectionResponse) => res.beaconNodeEndpoint + BEACON_API_SUFFIX,
  );
  readonly beaconNodeConnected$ = select$(
    this.beaconNodeState$,
    (res: NodeConnectionResponse) => res.connected,
  );
  readonly beaconNodeSyncing$ = select$(
    this.beaconNodeState$,
    (res: NodeConnectionResponse) => res.syncing,
  );

  private nodeStatus$ = this.http.get<NodeConnectionResponse>(`${this.apiUrl}/health/node_connection`);
  // Observables.
  readonly nodeStatusPoll$ = interval(POLLING_INTERVAL).pipe(
    startWith(0),
    mergeMap(_ => this.nodeStatus$),
    tap((res: NodeConnectionResponse) => {
      this.beaconNodeState$.next(res);
    })
  );
}
