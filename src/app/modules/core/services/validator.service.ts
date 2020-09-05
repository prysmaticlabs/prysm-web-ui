import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { zip, Observable, of } from 'rxjs';
import { switchMap, mergeMap, concatAll, mergeAll, combineAll } from 'rxjs/operators';

import { BeaconNodeService } from './beacon-node.service';
import { WalletService } from './wallet.service';

import {
  ValidatorBalances,
} from 'src/app/proto/eth/v1alpha1/beacon_chain'

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
  recentEpochBalances(): Observable<ValidatorBalances[]> {
    const balances = (beaconEndpoint: string, publicKeys: Uint8Array[], epoch: number) => {
      let params = `?epoch=${epoch}&publicKeys=`
      publicKeys.forEach((key, _) => {
        params += `${this.encodePublicKey(key)}&publicKeys=`;
      });
      return this.http.get<ValidatorBalances>(`${beaconEndpoint}/validators/balances${params}`);
    };
    return of([7118, 7119, 7120]).pipe(
      concatAll(),
      mergeMap((epoch: number) => {
        return zip(this.beaconNodeService.beaconEndpoint$, this.walletService.validatingPublicKeys$).pipe(
          switchMap((result: [string, Uint8Array[]]) => {
            const endpoint = result[0];
            const publicKeys = result[1]
            return balances(endpoint, publicKeys, epoch);
          }),
        );
      }),
    );
  }

  private encodePublicKey(key: Uint8Array): string {
    return encodeURIComponent(key.toString());
  }
}
