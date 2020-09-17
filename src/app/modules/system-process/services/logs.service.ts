import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { delayWhen, retryWhen, tap } from 'rxjs/operators';

const VALIDATOR_WS_ENDPOINT = 'ws://localhost:8081/logs';
const BEACON_WS_ENDPOINT = 'ws://localhost:8080/logs';
const RECONNECT_INTERVAL = 3000;

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  constructor() { }

  validatorLogs(): Observable<MessageEvent> {
    return this.connect(VALIDATOR_WS_ENDPOINT);
  }

  beaconLogs(): Observable<MessageEvent> {
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
          delayWhen(_ => timer(RECONNECT_INTERVAL)),
        )
      ),
    );
  }
}
