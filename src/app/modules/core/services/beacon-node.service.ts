import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { interval, Observable } from 'rxjs';
import { startWith, mergeMap, shareReplay, map } from 'rxjs/operators';

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

  // Observables.
  status$ = this.http.get<NodeConnectionResponse>(`${this.apiUrl}/health/node_connection`);
  beaconEndpoint$: Observable<string> = this.status$.pipe(
    map((res: NodeConnectionResponse) => `http://${res.beaconNodeEndpoint}${BEACON_API_SUFFIX}`),
    shareReplay(1),
  );
  statusPoll$ = interval(POLLING_INTERVAL).pipe(
    startWith(0),
    mergeMap(_ => this.status$),
  );
}
