import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { concatMap, delay, map, mergeAll } from 'rxjs/operators';

import { stream } from '../../core/utils/ndjson';
import { EnvironmenterService } from '../../core/services/environmenter.service';
import { mockBeaconLogs, mockValidatorLogs } from 'src/app/modules/core/mocks/logs';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  constructor(
    private environmenter: EnvironmenterService,
  ) { }
  private apiUrl = this.environmenter.env.validatorEndpoint;

  validatorLogs(): Observable<string> {
    // Use mock data in development mode.
    // if (!this.environmenter.env.production) {
    //   const data = mockValidatorLogs.split('\n').map((v, _) => v);
    //   return of(data).pipe(
    //     mergeAll(),
    //     concatMap(x => of(x).pipe(
    //       delay(1500),
    //     ))
    //   );
    // }
    return stream(`${this.apiUrl}/health/logs/validator/stream`).pipe(
      map((obj: any) => obj.result.logs),
      mergeAll(),
    );
  }

  beaconLogs(): Observable<string> {
    // Use mock data in development mode.
    // if (!this.environmenter.env.production) {
    //   const data = mockBeaconLogs.split('\n').map((v, _) => v);
    //   return of(data).pipe(
    //     mergeAll(),
    //     concatMap(x => of(x).pipe(
    //       delay(1500),
    //     ))
    //   );
    // }
    return stream(`${this.apiUrl}/health/logs/beacon/stream`).pipe(
      map((obj: any) => obj.result.logs),
      mergeAll(),
    );
  }
}
