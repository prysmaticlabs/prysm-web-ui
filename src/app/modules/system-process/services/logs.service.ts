import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { concatMap, delay, delayWhen, mergeAll, retryWhen, tap } from 'rxjs/operators';
import { EnvironmenterService } from '../../core/services/environmenter.service';
import { mockBeaconLogs, mockValidatorLogs } from 'src/app/modules/core/mocks/logs';
import { BEACON_WS_ENDPOINT, VALIDATOR_WS_ENDPOINT, WS_RECONNECT_INTERVAL } from '../../core/constants';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  constructor(
    private environmenter: EnvironmenterService,
  ) { }

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
    return this.connect(VALIDATOR_WS_ENDPOINT);
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
    return this.connect(BEACON_WS_ENDPOINT);
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
