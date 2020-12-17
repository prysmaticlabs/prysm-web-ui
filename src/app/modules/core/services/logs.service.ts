import { Injectable } from '@angular/core';
import { stream } from '../../core/utils/ndjson';
import { Observable, of, timer } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { concatMap, delay, delayWhen, mergeAll, retryWhen, switchMap, tap } from 'rxjs/operators';
import { EnvironmenterService } from '../../core/services/environmenter.service';
import { mockBeaconLogs, mockValidatorLogs } from 'src/app/modules/core/mocks/logs';
import { WS_RECONNECT_INTERVAL } from '../../core/constants';
import { ValidatorService } from './validator.service';
import { LogsEndpointResponse } from 'src/app/proto/validator/accounts/v2/web_api';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private environmenter: EnvironmenterService,
  ) { }
  private apiUrl = this.environmenter.env.validatorEndpoint;

  streamValidatorLogs() {
    return stream(`${this.apiUrl}/health/logs/validator/stream`);
  }

  validatorLogs(): Observable<MessageEvent> {
    // Use mock data in development mode.
    if (!this.environmenter.env.production) {
      const data = mockValidatorLogs.split('\n').map((v, _) => {
        return { data: v } as MessageEvent;
      });
      return of(data).pipe(
        mergeAll(),
        concatMap(x => of(x).pipe(
          delay(1500),
        ))
      );
    }
    return this.validatorService.logsEndpoints$.pipe(
      switchMap((resp: LogsEndpointResponse) => this.connect(`ws://${resp.validatorLogsEndpoint}`)),
    );
  }

  beaconLogs(): Observable<MessageEvent> {
    // Use mock data in development mode.
    if (!this.environmenter.env.production) {
      const data = mockBeaconLogs.split('\n').map((v, _) => {
        return { data: v } as MessageEvent;
      });
      return of(data).pipe(
        mergeAll(),
        concatMap(x => of(x).pipe(
          delay(1500),
        ))
      );
    }
    return this.validatorService.logsEndpoints$.pipe(
      switchMap((resp: LogsEndpointResponse) => this.connect(`ws://${resp.beaconLogsEndpoint}`)),
    );
  }

  private connect(url: string): Observable<MessageEvent> {
    return webSocket({
      url,
      deserializer: msg => msg,
    }).pipe(
      this.reconnect,
    );
  }

  private reconnect(observable: Observable<MessageEvent>): Observable<MessageEvent> {
    return observable.pipe(
      retryWhen(errors =>
        errors.pipe(
          tap((err) => console.error(`LogsService trying to reconnect: ${err}`)),
          delayWhen(_ => timer(WS_RECONNECT_INTERVAL)),
        )
      ),
    );
  }
}
