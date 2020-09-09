import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { switchMap, startWith } from 'rxjs/operators';

import { BeaconNodeService } from './beacon-node.service';

import {
  ValidatorParticipationResponse,
} from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { interval } from 'rxjs';

const MILLISECONDS_PER_SLOT = 12000
const SLOTS_PER_EPOCH = 32
const POLLING_INTERVAL = SLOTS_PER_EPOCH * MILLISECONDS_PER_SLOT

@Injectable({
  providedIn: 'root',
})
export class ChainService {
  constructor(
    private http: HttpClient,
    private beaconService: BeaconNodeService,
  ) { }

  // Chain information.
  participation$ = interval(POLLING_INTERVAL).pipe(
    startWith(0),
    switchMap(_ => this.beaconService.nodeEndpoint$),
    switchMap((url: string) => {
      return this.http.get<ValidatorParticipationResponse>(`${url}/validators/participation`);
    }),
  );
}
