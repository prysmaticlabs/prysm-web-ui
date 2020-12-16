import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap, switchMap, startWith } from 'rxjs/operators';
import { interval, Observable } from 'rxjs';

import {
  ValidatorParticipationResponse, ValidatorQueue,
} from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { MILLISECONDS_PER_EPOCH } from '../constants';
import { EnvironmenterService } from './environmenter.service';

@Injectable({
  providedIn: 'root',
})
export class ChainService {
  constructor(
    private http: HttpClient,
    private environmenter: EnvironmenterService,
  ) { }

  private apiUrl = this.environmenter.env.validatorEndpoint;
  // Chain information.
  participation$: Observable<ValidatorParticipationResponse> = interval(MILLISECONDS_PER_EPOCH).pipe(
    startWith(0),
    switchMap(() => {
      return this.http.get<ValidatorParticipationResponse>(`${this.apiUrl}/beacon/participation`);
    }),
  );
  activationQueue$: Observable<ValidatorQueue> = this.http.get<ValidatorQueue>(`${this.apiUrl}/beacon/queue`);
}
