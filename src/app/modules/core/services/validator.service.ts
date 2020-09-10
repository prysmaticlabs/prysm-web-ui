import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { zip, Observable, of } from 'rxjs';
import { switchMap, mergeMap, concatAll, toArray, map, tap } from 'rxjs/operators';

import range from 'src/app/modules/core/utils/range';
import { BeaconNodeService } from './beacon-node.service';
import { WalletService } from './wallet.service';

import {
  ValidatorBalances, ValidatorPerformanceResponse, ValidatorParticipationResponse,
} from 'src/app/proto/eth/v1alpha1/beacon_chain';

export const MAX_EPOCH_LOOKBACK = 5;

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  constructor(
    private http: HttpClient,
    private beaconNodeService: BeaconNodeService,
    private walletService: WalletService,
  ) { }

  // Observables.
  performance$: Observable<ValidatorPerformanceResponse> = zip(
    this.beaconNodeService.nodeEndpoint$,
    this.walletService.validatingPublicKeys$
  ).pipe(
    switchMap((result: [string, Uint8Array[]]) => {
      const endpoint = result[0];
      const publicKeys = result[1];
      let params = `?publicKeys=`;
      publicKeys.forEach((key, _) => {
        params += `${this.encodePublicKey(key)}&publicKeys=`;
      });
      return this.http.get<ValidatorPerformanceResponse>(`${endpoint}/validators/performance${params}`);
    }),
  );

  recentEpochBalances(currentEpoch: number, lookback: number): Observable<ValidatorBalances[]> {
    if (lookback > MAX_EPOCH_LOOKBACK) {
      throw new Error(`Cannot request greater than ${MAX_EPOCH_LOOKBACK} max lookback epochs`);
    }
    let startEpoch = 0;
    // Ensure we do not underflow.
    if (lookback < currentEpoch) {
      startEpoch = currentEpoch - lookback;
    }
    // Retrieve the balances starting at the current epoch down to lookback
    // number of epochs in the input arguments.
    // 1. Create an array from [currentEpoch - lookback, ..., currentEpoch]
    // 2. Retrieve the beacon node endpoint and validator public keys and wait until we have both.
    // 3. Launch N concurrent requests for balances by epoch for each epoch in the array
    // 4. Combine the results into a single array observable.
    return of(range(startEpoch, currentEpoch)).pipe(
      concatAll(),
      mergeMap((epoch: number) => {
        return zip(
          this.beaconNodeService.nodeEndpoint$,
          this.walletService.validatingPublicKeys$
        ).pipe(
          switchMap((result: [string, Uint8Array[]]) => {
            const endpoint = result[0];
            const publicKeys = result[1];
            return this.balancesByEpoch(endpoint, publicKeys, epoch);
          }),
        );
      }),
      toArray(),
    );
  }

  balancesByEpoch(
    apiUrl: string,
    publicKeys: Uint8Array[],
    epoch: number,
  ): Observable<ValidatorBalances> {
    let params = `?epoch=${epoch}&publicKeys=`;
    publicKeys.forEach((key, _) => {
      params += `${this.encodePublicKey(key)}&publicKeys=`;
    });
    return this.http.get<ValidatorBalances>(`${apiUrl}/validators/balances${params}`);
  }

  private encodePublicKey(key: Uint8Array): string {
    return encodeURIComponent(key.toString());
  }
}
