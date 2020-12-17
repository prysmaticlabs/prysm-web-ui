import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { interval, Observable, of } from 'rxjs';
import { startWith, mergeMap, catchError, switchMap, map } from 'rxjs/operators';

import { Store } from 'src/app/modules/core/utils/simple-store';
import { DeepReadonly } from 'src/app/modules/core/utils/deep-freeze';
import { select$ } from 'src/app/modules/core/utils/select$';
import { EnvironmenterService } from './environmenter.service';

import {
  BeaconStatusResponse,
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
  private beaconNodeState$: Store<DeepReadonly<BeaconStatusResponse>> = new Store(
    {} as DeepReadonly<BeaconStatusResponse>,
  );

  // State field access.
  readonly nodeEndpoint$: Observable<string> = select$(
    this.checkState(),
    (res: DeepReadonly<BeaconStatusResponse>) => {
      return res.beaconNodeEndpoint + BEACON_API_PREFIX;
    }
  );
  readonly connected$: Observable<boolean> = select$(
    this.checkState(),
    (res: DeepReadonly<BeaconStatusResponse>) => res.connected,
  );
  readonly syncing$: Observable<boolean> = select$(
    this.checkState(),
    (res: DeepReadonly<BeaconStatusResponse>) => res.syncing,
  );
  readonly chainHead$: Observable<ChainHead> = select$(
    this.checkState(),
    (res: DeepReadonly<BeaconStatusResponse>) => res.chainHead,
  );
  readonly genesisTime$: Observable<number> = select$(
    this.checkState(),
    (res: DeepReadonly<BeaconStatusResponse>) => res.genesisTime,
  );
  readonly peers$: Observable<Peers> = this.http.get<Peers>(`${this.apiUrl}/beacon/peers`);
  readonly latestClockSlotPoll$: Observable<number> = interval(POLLING_INTERVAL).pipe(
    startWith(0),
    mergeMap(
      _ => select$(
        this.checkState(),
        (res: DeepReadonly<BeaconStatusResponse>) => res.genesisTime,
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

  private fetchNodeStatus(): Observable<BeaconStatusResponse> {
    return this.http.get<BeaconStatusResponse>(`${this.apiUrl}/beacon/status`);
  }

  // Initializers.
  private checkState(): Observable<DeepReadonly<BeaconStatusResponse>> {
    if (this.isEmpty(this.beaconNodeState$.getValue())) {
      return this.updateState();
    }
    return this.beaconNodeState$.asObservable();
  }

  private updateState(): Observable<DeepReadonly<BeaconStatusResponse>> {
    return this.fetchNodeStatus().pipe(
      catchError(_ => {
        return of({
          beaconNodeEndpoint: 'unknown',
          connected: false,
          syncing: false,
          chainHead: {
            headEpoch: 0,
          } as ChainHead,
        }) as Observable<BeaconStatusResponse>;
      }),
      switchMap(connStatus => {
        const state: DeepReadonly<BeaconStatusResponse> = connStatus;
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
