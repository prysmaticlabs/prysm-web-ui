import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { LogsService } from '../../services/logs.service';

interface LogMetrics {
  percentInfo: string;
  percentWarn: string;
  percentError: string;
}

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
  totalInfo = 0;
  totalWarn = 0;
  totalError = 0;
  totalLogs = 0;
  logMetrics$ = new BehaviorSubject<LogMetrics>({
    percentInfo: '0',
    percentWarn: '0',
    percentError: '0',
  });

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
        this.countLogMetrics(msg.data);
      })
    ).subscribe();
    this.logsService.beaconLogs().pipe(
      takeUntil(this.destroyed$$),
      tap((msg: MessageEvent) => {
        this.beaconMessages.push(msg.data);
        this.countLogMetrics(msg.data);
      })
    ).subscribe();
  }

  private countLogMetrics(log: string): void {
    const val = this.logMetrics$.getValue();
    if (!val || !log) {
      return;
    }
    if (log.indexOf('INFO') !== -1) {
      this.totalInfo++;
      this.totalLogs++;
    } else if (log.indexOf('WARN') !== -1) {
      this.totalWarn++;
      this.totalLogs++;
    } else if (log.indexOf('ERROR') !== -1) {
      this.totalError++;
      this.totalLogs++;
    }
    val.percentInfo = this.formatPercent(this.totalInfo);
    val.percentWarn = this.formatPercent(this.totalWarn);
    val.percentError = this.formatPercent(this.totalError);
    this.logMetrics$.next(val);
  }

  private formatPercent(count: number): string {
    return ((count / this.totalLogs) * 100).toFixed(0);
  }
}
