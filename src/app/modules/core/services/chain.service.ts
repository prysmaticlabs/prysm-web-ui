import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getAddress, getIcapAddress, hexlify, parseBytes32String, toUtf8Bytes, toUtf8String } from 'ethers/lib/utils';

import { switchMap } from 'rxjs/operators';

import { BeaconNodeService } from './beacon-node.service';

import {
  ValidatorParticipationResponse, ValidatorPerformanceResponse,
} from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { Observable, zip } from 'rxjs';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root',
})
export class ChainService {
  constructor(
    private http: HttpClient,
    private beaconService: BeaconNodeService,
    private walletService: WalletService
  ) { }

  validatorPerforamcne$(): Observable<ValidatorPerformanceResponse> {
    return zip(
      this.beaconService.nodeEndpoint$,
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
  }
  private encodePublicKey(key: Uint8Array): string {
    return getIcapAddress(hexlify(key));
  }

  // Chain information.
  participation$ = this.beaconService.nodeEndpoint$.pipe(
    switchMap((url: string) => {
      return this.http.get<ValidatorParticipationResponse>(`${url}/validators/participation`);
    })
  );
}
