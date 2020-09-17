import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { delayWhen, retryWhen, tap } from 'rxjs/operators';

const WS_ENDPOINT = 'ws://localhost:8081/logs';
const RECONNECT_INTERVAL = 3000;

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  constructor() { }
  private socket$: WebSocketSubject<string> | null = null;

  connect(): Observable<string> {
    if (!this.socket$ || this.socket$.closed) {
      // console.log('nonexistent');
      // this.socket$ = this.getNewWebSocket();
      return this.getNewWebSocket();
    }
    return this.socket$;
    // return this.socket$.pipe(
    //   this.reconnect,
    // );
  }

  close(): void {
    this.socket$?.complete();
  }

  private getNewWebSocket(): WebSocketSubject<string> {
    return webSocket(WS_ENDPOINT);
    //   url: WS_ENDPOINT,
    //   closeObserver: {
    //     next: () => {
    //       console.log('LogsService websocket connection closed');
    //       this.connect();
    //     }
    //   },
    // });
  }

  private reconnect(observable: Observable<string>): Observable<string> {
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
