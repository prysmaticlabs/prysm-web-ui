import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, zip } from 'rxjs';
import { map, share, switchMap } from 'rxjs/operators';
import {
  ValidatorBalances, Validators, ValidatorSummaryResponse
} from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { VersionResponse } from 'src/app/proto/validator/accounts/v2/web_api';
import { ListFeeRecipientResponse, SetFeeRecipientRequest } from 'src/app/proto/validator/accounts/v2/web_api_keymanager-api';
import { EnvironmenterService } from './environmenter.service';
import { WalletService } from './wallet.service';




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
  private keymanagerUrl = this.environmenter.env.keymanagerEndpoint;

  refreshTableDataTrigger$ = new Subject<Boolean>();

  version$: Observable<VersionResponse> = this.http.get<VersionResponse>(`${this.apiUrl}/health/version`).pipe(
    share(),
  );

  performance$: Observable<ValidatorSummaryResponse & ValidatorBalances> = this.walletService.validatingPublicKeys$.pipe(
    switchMap((publicKeys: string[]) => {
      let params = `?public_keys=`;
      publicKeys.forEach((key, _) => {
        params += `${this.encodePublicKey(key)}&public_keys=`;
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

  getFeeRecipient(publicKey:string): Observable< ListFeeRecipientResponse>{
    return this.http.get<ListFeeRecipientResponse>(`${this.keymanagerUrl}/validator/${publicKey}/feerecipient`)
  }

  setFeeRecipient(publicKey:string,request: SetFeeRecipientRequest){
    return this.http.post(`${this.keymanagerUrl}/validator/${publicKey}/feerecipient`,request)
  }

  deleteFeeRecipient(publicKey:string){
    return this.http.delete(`${this.keymanagerUrl}/validator/${publicKey}/feerecipient`)
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
    let params = `?page_size=${pageSize}&page_token=${pageIndex}`;
    params += `&public_keys=`;
    publicKeys.forEach((key, _) => {
      params += `${this.encodePublicKey(key)}&public_keys=`;
    });
    return params;
  }

  private encodePublicKey(key: string): string {
    return encodeURIComponent(key);
  }
}
