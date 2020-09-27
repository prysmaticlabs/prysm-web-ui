import { Injectable, EventEmitter } from '@angular/core'
import { Router, ActivatedRouteSnapshot, Event, NavigationEnd, UrlSegment } from '@angular/router'
import { Breadcrumb } from './breadcrumb.model'

@Injectable()
export class BreadcrumbService {
  breadcrumbChanged = new EventEmitter<Breadcrumb[]>(false);

  private breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router) {
    this.router.events.subscribe((routeEvent) => { this.onRouteEvent(routeEvent) });
  }
    
  onRouteEvent(routeEvent: Event) {
    if (!(routeEvent instanceof NavigationEnd)) { return };
      
    // Get the parent route snapshot
    let route: ActivatedRouteSnapshot = this.router.routerState.root.snapshot;
    let url: string = '';

    const newCrumbs: Breadcrumb[] = [];

    while (route.firstChild !== null) {
      route = route.firstChild;

      if (route.routeConfig === null) { continue };
      if (!route.routeConfig.path) { continue };
      
      url += `/${this.createUrl(route)}`;
      // Only include route paths with defined breadcrumb label
      if (!route.data['breadcrumb']) { continue };

      const newCrumb = this.createBreadcrumb(route, url);
      newCrumbs.push(newCrumb);
    }

    // Reassign with new breadcrumb and emit change
    this.breadcrumbs = newCrumbs;
    this.breadcrumbChanged.emit(this.breadcrumbs);
  }

  createBreadcrumb(route: ActivatedRouteSnapshot, url: string): Breadcrumb {
    return {
      displayName: route.data['breadcrumb'],
      url: url,
      route: route.routeConfig
    };
  }

  createUrl(route: ActivatedRouteSnapshot) {
    return route && route.url.map(function (s: UrlSegment) { return s.toString() }).join('/');
  }
}