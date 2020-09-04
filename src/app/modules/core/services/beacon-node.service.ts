import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { EnvironmenterService } from './environmenter.service';

@Injectable({
  providedIn: 'root',
})
export class BeaconNodeService {
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
}
