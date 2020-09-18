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
  percentInfo$ = new Subject<number>();
  percentDebug$ = new Subject<number>();
  totalLogs = 0;
  totalInfo = 0;
  totalDebug = 0;
  totalWarn = 0;
  totalError = 0;

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
        this.countLogLevels(msg.data);
      })
    ).subscribe();
    this.logsService.beaconLogs().pipe(
      takeUntil(this.destroyed$$),
      tap((msg: MessageEvent) => {
        this.beaconMessages.push(msg.data);
        this.countLogLevels(msg.data);
      })
    ).subscribe();
  }

  private countLogLevels(log: string): void {
    if (log.indexOf('INFO') !== -1) {
      this.totalInfo++;
      this.totalLogs++;
      this.percentInfo$.next((this.totalInfo / this.totalLogs) * 100);
    } else if (log.indexOf('DEBUG') !== -1) {
      this.totalDebug++;
      this.totalLogs++;
      this.percentDebug$.next((this.totalDebug / this.totalLogs) * 100);
    } else {
      console.log('does not have info');
    }
  }
}
