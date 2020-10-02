import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

import { EventsService } from 'src/app/modules/core/services/events.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'prysm-web-ui';
  constructor(
    private router: Router,
    private eventsService: EventsService,
  ) { }
  private destroyed$$ = new Subject<void>();

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      tap(() => {
        this.eventsService.routeChanged$.next(this.router.routerState.root.snapshot);
      }),
      takeUntil(this.destroyed$$),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$$.next();
    this.destroyed$$.complete();
  }
}
