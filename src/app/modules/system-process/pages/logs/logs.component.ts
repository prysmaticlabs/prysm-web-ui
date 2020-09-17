import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { LogsService } from '../../services/logs.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
})
export class LogsComponent implements OnInit, OnDestroy {
  constructor(
    private logsService: LogsService,
  ) { }
  private destroyed$$ = new Subject<void>();
  validatorMessages: string[] = [];
  beaconMessages: string[] = [];

  ngOnInit(): void {
    this.subscribeLogs();
  }

  ngOnDestroy(): void {
    this.destroyed$$.next();
    this.destroyed$$.complete();
  }

  private subscribeLogs(): void {
    this.logsService.validatorLogs().pipe(
      takeUntil(this.destroyed$$),
      tap((msg: MessageEvent) => {
        this.validatorMessages.push(msg.data);
      })
    ).subscribe();
    this.logsService.beaconLogs().pipe(
      takeUntil(this.destroyed$$),
      tap((msg: MessageEvent) => {
        this.beaconMessages.push(msg.data);
      })
    ).subscribe();
  }
}
