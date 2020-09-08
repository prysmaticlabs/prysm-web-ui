import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { interval, Observable } from 'rxjs';
import { flatZipMap } from 'rxjs-pipe-ext';
import { tap, startWith, mergeMap, take } from 'rxjs/operators';

import { Store } from 'src/app/modules/core/utils/simple-store';
import { select$ } from 'src/app/modules/core/utils/select$';
import { EnvironmenterService } from './environmenter.service';

import {
  NodeConnectionResponse,
} from 'src/app/proto/validator/accounts/v2/web_api';
import {
  ChainHead,
} from 'src/app/proto/eth/v1alpha1/beacon_chain';

const POLLING_INTERVAL = 3000;

interface NodeState {
  nodeConnection: NodeConnectionResponse,
  chainHead: ChainHead,
}

@Injectable({
  providedIn: 'root',
})
export class BeaconNodeService {
  constructor(
    private http: HttpClient,
    private environmenter: EnvironmenterService,
  ) {
    this.fetchNodeStatus().pipe(
      take(1),
      flatZipMap((connStatus: NodeConnectionResponse) => {
        return this.fetchChainHead(connStatus.beaconNodeEndpoint);
      }),
      take(1),
      tap(([connStatus, chainHead]) => {
        const state: NodeState = {
          nodeConnection: connStatus,
          chainHead: chainHead,
        };
        this.beaconNodeState$.next(state);
      })
    ).subscribe();
  }

  private apiUrl = this.environmenter.env.validatorEndpoint;

  // Create a reliable, immutable store for storing the 
  // connection response with replayability.
  private beaconNodeState$ = new Store({} as NodeState);

  // Observables.
  readonly nodeEndpoint$: Observable<string> = select$(
    this.beaconNodeState$,
    (res: NodeState) => res.nodeConnection.beaconNodeEndpoint + BEACON_API_SUFFIX,
  );
  readonly connected$: Observable<boolean> = select$(
    this.beaconNodeState$,
    (res: NodeState) => res.nodeConnection.connected,
  );
  readonly syncing$: Observable<boolean> = select$(
    this.beaconNodeState$,
    (res: NodeState) => res.nodeConnection.syncing,
  );
  readonly chainHead$: Observable<ChainHead> = select$(
    this.beaconNodeState$,
    (res: NodeState) => res.chainHead,
  );

  readonly nodeStatusPoll$ = interval(POLLING_INTERVAL).pipe(
    startWith(0),
    mergeMap(this.fetchNodeStatus),
    flatZipMap((res: NodeConnectionResponse) => this.fetchChainHead(res.beaconNodeEndpoint)),
    tap(([connStatus, chainHead]) => {
      const state: NodeState = {
        nodeConnection: connStatus,
        chainHead: chainHead,
      };
      this.beaconNodeState$.next(state);
    })
  );

  // Http requests.
  private fetchChainHead(nodeEndpoint: string): Observable<ChainHead> {
    return this.http.get<ChainHead>(`${nodeEndpoint}/beacon/chainhead`);
  }

  private fetchNodeStatus(): Observable<NodeConnectionResponse> {
    return this.http.get<NodeConnectionResponse>(`${this.apiUrl}/health/node_connection`);
  }
}
