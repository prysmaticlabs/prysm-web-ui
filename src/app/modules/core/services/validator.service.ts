import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { zip, Observable, of, throwError, EMPTY } from 'rxjs';
import { switchMap, mergeMap, concatAll, toArray, retry, catchError, map, shareReplay } from 'rxjs/operators';

import range from 'src/app/modules/core/utils/range';
import { BeaconNodeService } from './beacon-node.service';
import { WalletService } from './wallet.service';

import {
  ValidatorBalances, ValidatorPerformanceResponse, Validators, ValidatorQueue,
} from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { hexToBase64 } from '../utils/hex-util';
import { ListAccountsResponse, LogsEndpointResponse } from 'src/app/proto/validator/accounts/v2/web_api';
import { EnvironmenterService } from './environmenter.service';

export const MAX_EPOCH_LOOKBACK = 10;

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  constructor(
    private http: HttpClient,
    private beaconNodeService: BeaconNodeService,
    private walletService: WalletService,
    private environmenter: EnvironmenterService,
  ) { }

  private apiUrl = this.environmenter.env.validatorEndpoint;
  logsEndpoints$: Observable<LogsEndpointResponse> = this.http.get<LogsEndpointResponse>(`${this.apiUrl}/health/logs/endpoints`).pipe(
    shareReplay(),
  );

  // Observables.
  activationQueue$: Observable<ValidatorQueue> = this.beaconNodeService.nodeEndpoint$.pipe(
    switchMap(endpoint =>
      this.http.get<ValidatorQueue>(`${endpoint}/validators/queue`)
    ),
  );

  performance$: Observable<ValidatorPerformanceResponse & ValidatorBalances> = zip(
    this.beaconNodeService.nodeEndpoint$,
    this.walletService.validatingPublicKeys$
  ).pipe(
    switchMap((result: [string, string[]]) => {
      const publicKeys = result[1];
      const endpoint = result[0];
      let params = `?publicKeys=`;
      publicKeys.forEach((key, _) => {
        params += `${this.encodePublicKey(key)}&publicKeys=`;
      });
      const balances = this.balances(publicKeys, 0, publicKeys.length);
      const httpReq = this.http.get<ValidatorPerformanceResponse>(`${endpoint}/validators/performance${params}`);
      return zip(httpReq, balances).pipe(
        map(([perf, bals]) => {
          return {
            ...perf,
            ...bals,
          };
        }),
      );
    }),
  );

  recentEpochBalances(
    currentEpoch: number, lookback: number, numAccounts: number,
  ): Observable<ValidatorBalances[]> {
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
          this.walletService.accounts(0, numAccounts),
        ).pipe(
          switchMap((result: [string, ListAccountsResponse]) => {
            const endpoint = result[0];
            const publicKeys = result[1].accounts.map(acc => acc.validatingPublicKey);
            return this.balancesByEpoch(endpoint, publicKeys, epoch, 0, numAccounts);
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
    pageIndex: number,
    pageSize: number,
  ): Observable<ValidatorBalances> {
    let params = `?epoch=${epoch}&publicKeys=`;
    publicKeys.forEach((key, _) => {
      params += `${this.encodePublicKey(key)}&publicKeys=`;
    });
    params += `&pageSize=${pageSize}&pageToken=${pageIndex}`;
    return this.http.get<ValidatorBalances>(`${apiUrl}/validators/balances${params}`);
  }

  validatorList(
    publicKeys: string[],
    pageIndex: number,
    pageSize: number,
  ): Observable<Validators> {
    return this.beaconNodeService.nodeEndpoint$.pipe(
      switchMap((endpoint: string) => {
        const params = this.formatURIParameters(publicKeys, pageIndex, pageSize);
        return this.http.get<Validators>(`${endpoint}/validators${params}`);
      }),
    );
  }

  balances(
    publicKeys: string[],
    pageIndex: number,
    pageSize: number,
  ): Observable<ValidatorBalances> {
    return this.beaconNodeService.nodeEndpoint$.pipe(
      switchMap((endpoint: string) => {
        const params = this.formatURIParameters(publicKeys, pageIndex, pageSize);
        return this.http.get<ValidatorBalances>(`${endpoint}/validators/balances${params}`);
      }),
    );
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
}
