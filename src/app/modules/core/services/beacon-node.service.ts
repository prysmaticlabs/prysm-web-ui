import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { interval } from 'rxjs';
import { tap, startWith, mergeMap } from 'rxjs/operators';

import { EnvironmenterService } from './environmenter.service';
import {
  NodeConnectionResponse,
} from 'src/app/proto/validator/accounts/v2/web_api';

const POLLING_INTERVAL = 5000;

@Injectable({
  providedIn: 'root',
})
export class BeaconNodeService {
  constructor(
    private http: HttpClient,
    private environmenter: EnvironmenterService,
  ) { }

  private apiUrl = this.environmenter.env.validatorEndpoint;
  private beaconNodeEndpoint: string;

  // Observables.
  status$ = this.http.get<NodeConnectionResponse>(`${this.apiUrl}/health/node_connection`).pipe(
    tap((res: NodeConnectionResponse) => {
      this.beaconNodeEndpoint = res.beaconNodeEndpoint;
    }),
  );
  statusPoll$ = interval(POLLING_INTERVAL).pipe(
    startWith(0),
    mergeMap(_ => this.status$),
  );
}
