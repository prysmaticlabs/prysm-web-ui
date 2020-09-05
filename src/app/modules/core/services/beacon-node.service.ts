import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { interval } from 'rxjs';
import { tap, startWith, mergeMap, switchMap } from 'rxjs/operators';

import { EnvironmenterService } from './environmenter.service';
import { WalletService } from './wallet.service';

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
    private walletService: WalletService,
  ) { }

  private apiUrl = this.environmenter.env.validatorEndpoint;
  private beaconNodeEndpoint: string;

  // Observables.
  status$ = this.http.get<NodeConnectionResponse>(`${this.apiUrl}/health/node_connection`).pipe(
    tap((res: NodeConnectionResponse) => {
      this.beaconNodeEndpoint = res.beaconNodeEndpoint + BEACON_API_SUFFIX;
    }),
  );
  statusPoll$ = interval(POLLING_INTERVAL).pipe(
    startWith(0),
    mergeMap(_ => this.status$),
  );
}
