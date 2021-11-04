import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { zip, Observable, of } from 'rxjs';
import { switchMap, mergeMap, concatAll, toArray, map, shareReplay, share } from 'rxjs/operators';

import range from 'src/app/modules/core/utils/range';
import { WalletService } from './wallet.service';

import {
  ValidatorBalances, ValidatorSummaryResponse, Validators,
} from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { ListAccountsResponse, LogsEndpointResponse, VersionResponse } from 'src/app/proto/validator/accounts/v2/web_api';
import { EnvironmenterService } from './environmenter.service';

export const MAX_EPOCH_LOOKBACK = 10;

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  constructor(
    private http: HttpClient,
    private walletService: WalletService,
    private environmenter: EnvironmenterService,
  ) { }
  private apiUrl = this.environmenter.env.validatorEndpoint;

  version$: Observable<VersionResponse> = this.http.get<VersionResponse>(`${this.apiUrl}/health/version`).pipe(
    share(),
  );

  performance$: Observable<ValidatorSummaryResponse & ValidatorBalances> = this.walletService.validatingPublicKeys$.pipe(
    switchMap((publicKeys: string[]) => {
      let params = `?publicKeys=`;
      publicKeys.forEach((key, _) => {
        params += `${this.encodePublicKey(key)}&publicKeys=`;
      });
      const balances = this.balances(publicKeys, 0, publicKeys.length);
      const httpReq = this.http.get<ValidatorSummaryResponse>(`${this.apiUrl}/beacon/summary${params}`);
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

  validatorList(
    publicKeys: string[],
    pageIndex: number,
    pageSize: number,
  ): Observable<Validators> {
    const params = this.formatURIParameters(publicKeys, pageIndex, pageSize);
    return this.http.get<Validators>(`${this.apiUrl}/beacon/validators${params}`);
  }

  balances(
    publicKeys: string[],
    pageIndex: number,
    pageSize: number,
  ): Observable<ValidatorBalances> {
    const params = this.formatURIParameters(publicKeys, pageIndex, pageSize);
    return this.http.get<ValidatorBalances>(`${this.apiUrl}/beacon/balances${params}`);
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
