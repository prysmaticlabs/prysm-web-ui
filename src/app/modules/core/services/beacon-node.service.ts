import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { interval, Observable, EMPTY, of } from 'rxjs';
import { flatZipMap } from 'rxjs-pipe-ext/lib';
import { startWith, mergeMap, catchError, switchMap, map } from 'rxjs/operators';

import { Store } from 'src/app/modules/core/utils/simple-store';
import { DeepReadonly } from 'src/app/modules/core/utils/deep-freeze';
import { select$ } from 'src/app/modules/core/utils/select$';
import { EnvironmenterService } from './environmenter.service';

import {
  NodeConnectionResponse,
} from 'src/app/proto/validator/accounts/v2/web_api';
import {
  ChainHead,
} from 'src/app/proto/eth/v1alpha1/beacon_chain';
import {
  Peers,
} from 'src/app/proto/eth/v1alpha1/node';

export const POLLING_INTERVAL = 3000;
export const SECONDS_PER_SLOT = 12;
export const BEACON_API_PREFIX = '/eth/v1alpha1';

interface NodeState {
  nodeConnection: NodeConnectionResponse;
  chainHead: ChainHead;
}

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
  private beaconNodeState$: Store<DeepReadonly<NodeState>> = new Store(
    {} as DeepReadonly<NodeState>,
  );

  // State field access.
  readonly nodeEndpoint$: Observable<string> = select$(
    this.checkState(),
    (res: DeepReadonly<NodeState>) => {
      return 'http://' + res.nodeConnection.beaconNodeEndpoint + BEACON_API_PREFIX;
    }
  );
  readonly connected$: Observable<boolean> = select$(
    this.checkState(),
    (res: DeepReadonly<NodeState>) => res.nodeConnection?.connected,
  );
  readonly syncing$: Observable<boolean> = select$(
    this.checkState(),
    (res: DeepReadonly<NodeState>) => res.nodeConnection?.syncing,
  );
  readonly chainHead$: Observable<ChainHead> = select$(
    this.checkState(),
    (res: DeepReadonly<NodeState>) => res.chainHead,
  );
  readonly genesisTime$: Observable<number> = select$(
    this.checkState(),
    (res: DeepReadonly<NodeState>) => res.nodeConnection?.genesisTime,
  );
  readonly peers$: Observable<Peers> = this.http.get<Peers>(`${this.apiUrl}/beacon/peers`);
  readonly latestClockSlotPoll$: Observable<number> = interval(POLLING_INTERVAL).pipe(
    startWith(0),
    mergeMap(
      _ => select$(
        this.checkState(),
        (res: DeepReadonly<NodeState>) => res.nodeConnection?.genesisTime,
      )
    ),
    map((genesisTimeUnix: number) => {
      const currentTime = Math.floor(Date.now() / 1000);
      return Math.floor((currentTime - genesisTimeUnix) / SECONDS_PER_SLOT);
    }),
  );
  readonly nodeStatusPoll$ = interval(POLLING_INTERVAL).pipe(
    startWith(0),
    mergeMap(_ => this.updateState()),
  );

  // Http requests.
  private fetchChainHead(nodeEndpoint: string): Observable<ChainHead> {
    return this.http.get<ChainHead>(`${nodeEndpoint}/beacon/chainhead`);
  }

  private fetchNodeStatus(): Observable<NodeConnectionResponse> {
    return this.http.get<NodeConnectionResponse>(`${this.apiUrl}/health/node_connection`);
  }

  // Initializers.
  private checkState(): Observable<DeepReadonly<NodeState>> {
    if (this.isEmpty(this.beaconNodeState$.getValue())) {
      return this.updateState();
    }
    return this.beaconNodeState$.asObservable();
  }

  private updateState(): Observable<DeepReadonly<NodeState>> {
    return this.fetchNodeStatus().pipe(
      catchError(_ => {
        return of({
          beaconNodeEndpoint: 'unknown',
          connected: false,
          syncing: false,
        }) as Observable<NodeConnectionResponse>;
      }),
      flatZipMap((res: NodeConnectionResponse) => {
        return this.fetchChainHead('http://' + res.beaconNodeEndpoint + BEACON_API_PREFIX).pipe(
          catchError(_ => {
            return of({
              headEpoch: 0,
            }) as Observable<ChainHead>;
          }),
        );
      }),
      switchMap(([connStatus, chainHead]) => {
        const state: DeepReadonly<NodeState> = {
          nodeConnection: connStatus,
          chainHead,
        };
        this.beaconNodeState$.next(state);
        return this.beaconNodeState$;
      }),
    );
  }

  private isEmpty(obj: object): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }
}
