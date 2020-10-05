import { Component } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { ActivatedRouteSnapshot } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { EventsService } from 'src/app/modules/core/services/events.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent {
  constructor(
    private breadcrumbService: BreadcrumbService,
    private eventsService: EventsService,
  ) {
  }
  breadcrumbs$ = this.eventsService.routeChanged$.pipe(
    switchMap((route: ActivatedRouteSnapshot) =>
      this.breadcrumbService.create(route)
    ),
  );
}
