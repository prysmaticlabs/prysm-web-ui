import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';
import { LogsService } from '../../services/logs.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import {
  default as AnsiUp
} from 'ansi_up';

@Component({
  selector: 'app-validator-logs-stream',
  templateUrl: './validator-logs-stream.component.html',
})
export class ValidatorLogsStreamComponent implements OnInit, OnDestroy {
  constructor(
    private logsService: LogsService,
    private sanitizer: DomSanitizer
  ) { }
  private destroyed$$ = new Subject<void>();
  ansiUp = new AnsiUp();
  messages: string[] = [];

  ngOnInit(): void {
    webSocket({
      url: 'ws://localhost:8081/logs',
      deserializer: msg => msg,
    }).pipe(
      takeUntil(this.destroyed$$),
    ).subscribe((msg: MessageEvent) => {
      this.messages.push(msg.data);
    });
  }

  ngOnDestroy(): void {
    this.destroyed$$.next();
    this.destroyed$$.complete();
    this.logsService.close();
  }

  formatLog(msg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.ansiUp.ansi_to_html(msg));
  }
}
