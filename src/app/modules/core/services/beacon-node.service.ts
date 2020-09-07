import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { interval } from 'rxjs';
import { tap, startWith, mergeMap } from 'rxjs/operators';

import { Store } from 'src/app/modules/core/utils/simple-store';
import { select$ } from 'src/app/modules/core/utils/select$';
import { EnvironmenterService } from './environmenter.service';

import {
  NodeConnectionResponse,
} from 'src/app/proto/validator/accounts/v2/web_api';

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
  beaconNodeState$ = new Store({} as NodeConnectionResponse);
  beaconNodeEndpoint$ = select$(
    this.beaconNodeState$,
    (res: NodeConnectionResponse) => res.beaconNodeEndpoint + BEACON_API_SUFFIX,
  );
  beaconNodeConnected$ = select$(
    this.beaconNodeState$,
    (res: NodeConnectionResponse) => res.connected,
  );
  beaconNodeSyncing$ = select$(
    this.beaconNodeState$,
    (res: NodeConnectionResponse) => res.syncing,
  );

  // Observables.
  nodeStatusPoll$ = interval(POLLING_INTERVAL).pipe(
    startWith(0),
    mergeMap(_ => this.http.get<NodeConnectionResponse>(`${this.apiUrl}/health/node_connection`)),
    tap((res: NodeConnectionResponse) => {
      this.beaconNodeState$.next(res);
    }),
  );
}
