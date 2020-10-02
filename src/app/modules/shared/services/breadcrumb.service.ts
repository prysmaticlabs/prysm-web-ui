import { Injectable } from '@angular/core';
import {
  Route,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';

export interface Breadcrumb {
  displayName: string;
  url: string;
  route?: Route;
}

@Injectable()
export class BreadcrumbService {
  constructor() { }

  create(route: ActivatedRouteSnapshot): Observable<Breadcrumb[]> {
    let url = '';
    const newCrumbs: Breadcrumb[] = [];

    while (route.firstChild) {
      route = route.firstChild;
      if (!route.routeConfig) {
        continue;
      }
      if (!route.routeConfig.path) {
        continue;
      }
      url += `/${this.createUrl(route)}`;
      // Only include route paths with defined breadcrumb label.
      if (!route.data.breadcrumb) {
        continue;
      }
      const newCrumb = this.initializeBreadcrumb(route, url);
      newCrumbs.push(newCrumb);
    }
    return of(newCrumbs);
  }

  private initializeBreadcrumb(route: ActivatedRouteSnapshot, url: string): Breadcrumb {
    const breadcrumb: Breadcrumb = {
      displayName: route.data.breadcrumb,
      url,
    };
    if (route.routeConfig) {
      breadcrumb.route = route.routeConfig;
    }
    return breadcrumb;
  }

  private createUrl(route: ActivatedRouteSnapshot): string {
    return route && route.url.map(String).join('/');
  }
}
