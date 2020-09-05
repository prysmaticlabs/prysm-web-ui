import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { throwError, zip, Observable, of } from 'rxjs';
import { switchMap, mergeMap, concatAll, toArray } from 'rxjs/operators';

import { BeaconNodeService } from './beacon-node.service';
import { WalletService } from './wallet.service';

import {
  ValidatorBalances,
} from 'src/app/proto/eth/v1alpha1/beacon_chain';

const MAX_EPOCH_LOOKBACK = 5;

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
  recentEpochBalances(currentEpoch: number, lookback: number): Observable<ValidatorBalances[]> {
    if (lookback > MAX_EPOCH_LOOKBACK) {
      return throwError('Cannot request greater than max lookback epochs');
    }
    let startEpoch = 0;
    if (MAX_EPOCH_LOOKBACK < currentEpoch) {
      startEpoch = currentEpoch - MAX_EPOCH_LOOKBACK;
    }
    return of(this.range(startEpoch, currentEpoch)).pipe(
      concatAll(),
      mergeMap((epoch: number) => {
        return zip(
          this.beaconNodeService.beaconEndpoint$,
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

  private balancesByEpoch(
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

  private range(start: number, end: number): number[] {
    return Array(end - start).map((_, idx) => start + idx);
  }
}
