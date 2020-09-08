import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { switchMap } from 'rxjs/operators';

import { BeaconNodeService } from './beacon-node.service';

import {
  ValidatorParticipationResponse,
} from 'src/app/proto/eth/v1alpha1/beacon_chain';

@Injectable({
  providedIn: 'root',
})
export class ChainService {
  constructor(
    private http: HttpClient,
    private beaconService: BeaconNodeService,
  ) { }

  // Chain information.
  participation$ = this.beaconService.nodeEndpoint$.pipe(
    switchMap((url: string) => {
      return this.http.get<ValidatorParticipationResponse>(`${url}/validators/participation`);
    })
  );
}
