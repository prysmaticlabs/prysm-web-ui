import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { zip, Observable, of, throwError, EMPTY } from 'rxjs';
import { switchMap, mergeMap, concatAll, toArray, retry, catchError } from 'rxjs/operators';

import range from 'src/app/modules/core/utils/range';
import { BeaconNodeService } from './beacon-node.service';
import { WalletService } from './wallet.service';

import {
  ValidatorBalances, ValidatorPerformanceResponse, Validators, ValidatorQueue,
} from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { hexToBase64 } from '../utils/hex-util';

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
  activationQueue$: Observable<ValidatorQueue> = this.beaconNodeService.nodeEndpoint$.pipe(
    switchMap(endpoint =>
      this.http.get<ValidatorQueue>(`${endpoint}/validators/queue`)
    ),
  );

  performance$: Observable<ValidatorPerformanceResponse> = zip(
    this.beaconNodeService.nodeEndpoint$,
    this.walletService.validatingPublicKeys$
  ).pipe(
    switchMap((result: [string, string[]]) => {
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
          switchMap((result: [string, string[]]) => {
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
    publicKeys: string[],
    epoch: number,
  ): Observable<ValidatorBalances> {
    let params = `?epoch=${epoch}&publicKeys=`;
    publicKeys.forEach((key, _) => {
      params += `${this.encodePublicKey(key)}&publicKeys=`;
    });
    return this.http.get<ValidatorBalances>(`${apiUrl}/validators/balances${params}`);
  }

  validatorList(
    publicKeys: string[],
    pageIndex: number,
    pageSize: number,
  ): Observable<Validators> {
    let keys = publicKeys;
    return this.beaconNodeService.nodeEndpoint$.pipe(
      switchMap((endpoint: string) => {
        const params = this.formatURIParameters(keys, pageIndex, pageSize);
        return this.http.get<Validators>(`${endpoint}/validators${params}`);
      }),
      // catchError((err: HttpErrorResponse) => {
      //   console.log(err.error);
      //   const msg = err.error.message as string;
      //   console.log(msg.indexOf('Could not find validator index for public key') !== -1);
      //   if (this.isPubKeyNotFound(msg)) {
      //     const pubKeyIdx = msg.indexOf('0x');
      //     console.log(msg);
      //     console.log(msg.indexOf('0x'));
      //     if (pubKeyIdx !== -1) {
      //       const pubKey = hexToBase64(msg.slice(pubKeyIdx, msg.length));
      //       console.log(msg.slice(pubKeyIdx, msg.length))
      //       console.log('Keys before');
      //       console.log(keys);
      //       keys = keys.filter(val => val !== pubKey);
      //       console.log('Keys after NICHI');
      //       console.log(keys);
      //     }
      //   }
      //   return throwError(err);
      // }),
      // retry(keys.length),
    );
  }

  balances(
    publicKeys: string[],
    pageIndex: number,
    pageSize: number,
  ): Observable<ValidatorBalances> {
    let keys = publicKeys;
    return this.beaconNodeService.nodeEndpoint$.pipe(
      switchMap((endpoint: string) => {
        const params = this.formatURIParameters(keys, pageIndex, pageSize);
        return this.http.get<ValidatorBalances>(`${endpoint}/validators/balances${params}`);
      }),
    );
  }

  private checkPubKeyNotFoundError(err: HttpErrorResponse): Observable<never> {
    const msg = err.error.message as string;
    if (this.isPubKeyNotFound(msg)) {
      const pubKeyIdx = msg.indexOf('0x');
      if (pubKeyIdx !== -1) {
        const pubKey = msg.slice(pubKeyIdx, msg.length);
        console.log(pubKey);
        console.log(hexToBase64(pubKey));
        return EMPTY;
      }
    }
    return throwError(err);
  }

  private formatURIParameters(
    publicKeys: string[],
    pageIndex: number,
    pageSize: number,
  ): string {
    let params = `?pageSize=${pageSize}&pageToken=${pageIndex}`;
    params += `&publicKeys=`;
    publicKeys.forEach((key, _) => {
      params += `${this.encodePublicKey(key)}&publicKeys=`;
    });
    return params;
  }

  private encodePublicKey(key: string): string {
    return encodeURIComponent(key);
  }

  private isPubKeyNotFound(msg: string): boolean {
    return msg.indexOf('Could not find validator index for public key') !== -1;
  }
}
