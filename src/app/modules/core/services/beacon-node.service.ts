import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { interval } from 'rxjs';
import { tap, startWith, mergeMap, take } from 'rxjs/operators';

import { Store } from 'src/app/modules/core/utils/simple-store';
import { select$ } from 'src/app/modules/core/utils/select$';
import { EnvironmenterService } from './environmenter.service';

import {
  NodeConnectionResponse,
} from 'src/app/proto/validator/accounts/v2/web_api';

const POLLING_INTERVAL = 3000;
const BEACON_API_PREFIX = '/eth/v1alpha1';

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
  private nodeStatus$ = this.http.get<NodeConnectionResponse>(`${this.apiUrl}/health/node_connection`);

  // Observables.
  readonly nodeEndpoint$ = select$(
    this.beaconNodeState$,
    (res: NodeConnectionResponse) => res.beaconNodeEndpoint + BEACON_API_PREFIX,
  );
  readonly connected$ = select$(
    this.beaconNodeState$,
    (res: NodeConnectionResponse) => res.connected,
  );
  readonly syncing$ = select$(
    this.beaconNodeState$,
    (res: NodeConnectionResponse) => res.syncing,
  );

  readonly nodeStatusPoll$ = interval(POLLING_INTERVAL).pipe(
    startWith(0),
    mergeMap(_ => this.nodeStatus$),
    tap((res: NodeConnectionResponse) => {
      this.beaconNodeState$.next(res);
    })
  );
}
