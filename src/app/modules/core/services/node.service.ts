import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { share, tap, map, switchMap } from 'rxjs/operators';
import { EnvironmenterService } from './environmenter.service';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  constructor(
    private http: HttpClient,
    private environmenter: EnvironmenterService,
  ) { }

  private apiUrl = this.environmenter.env.validatorEndpoint;
  private beaconNodeEndpoint: string;

  // Observables.
  conn$ = this.http.get<object>(`${this.apiUrl}/health/node_connection`).pipe(
    tap((res: any)=> {
      this.beaconNodeEndpoint = res.beaconNodeEndpoint;
    }),
  );

  balances$ = this.http.get<object>(`${this.apiUrl}/health/node_connection`).pipe(
    map((item: any) => item.beaconNodeEndpoint),
    switchMap((endpoint: string) => {
      return this.http.get<object>(`http://${endpoint}/eth/v1alpha1/validators/balances?publicKeys=mL46sXVihvQaeegEC4iX3K3jiFfm%2FAu2b3QVOSsjHj0B4q1W8jG7w9NsRok%2Bf9s%2F&publicKeys=`);
    }),
  );
}
