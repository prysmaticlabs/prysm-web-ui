import { ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { take, tap } from 'rxjs/operators';

import { Breadcrumb, BreadcrumbService } from './breadcrumb.service';

describe('BreadcrumbService', () => {
  it('should return empty breadcrumbs for empty route snapshot', done => {
    const service = new BreadcrumbService();
    service.create({} as ActivatedRouteSnapshot).pipe(
      take(1),
      tap((breadcrumbs: Breadcrumb[]) => {
        expect(breadcrumbs.length).toEqual(0);
        done();
      }),
    ).subscribe();
  });

  it('should properly determine hierarchy from route snapshot', done => {
    const service = new BreadcrumbService();
    service.create({
      firstChild: {
        url: [] as UrlSegment[],
        routeConfig: {
          path: 'dashboard',
        },
        data: {
          breadcrumb: 'Dashboard',
        },
        firstChild: {
          url: [] as UrlSegment[],
          routeConfig: {
            path: 'accounts',
          },
          data: {
            breadcrumb: 'Accounts',
          },
        } as Partial<ActivatedRouteSnapshot>
      } as Partial<ActivatedRouteSnapshot>
    } as ActivatedRouteSnapshot).pipe(
      take(1),
      tap((breadcrumbs: Breadcrumb[]) => {
        const hierarchy = breadcrumbs.map(b => b.displayName);
        expect(hierarchy).toEqual(['Dashboard', 'Accounts']);
        done();
      }),
    ).subscribe();
  });

  it('should exclude elements without a breadcrumb data property from the hierarchy', done => {
    const service = new BreadcrumbService();
    service.create({
      firstChild: {
        url: [] as UrlSegment[],
        routeConfig: {
          path: 'dashboard',
        },
        data: {},
        firstChild: {
          url: [] as UrlSegment[],
          routeConfig: {
            path: 'accounts',
          },
          data: {
            breadcrumb: 'Accounts',
          },
        } as Partial<ActivatedRouteSnapshot>
      } as Partial<ActivatedRouteSnapshot>
    } as ActivatedRouteSnapshot).pipe(
      take(1),
      tap((breadcrumbs: Breadcrumb[]) => {
        const hierarchy = breadcrumbs.map(b => b.displayName);
        expect(hierarchy).toEqual(['Accounts']);
        done();
      }),
    ).subscribe();
  });
});
