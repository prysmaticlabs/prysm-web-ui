import { Injectable, EventEmitter } from '@angular/core'
import { Router, ActivatedRouteSnapshot, Event, NavigationEnd } from '@angular/router'
import { Breadcrumb } from './breadcrumb.model'

@Injectable()
export class BreadcrumbService {
  breadcrumbChanged = new EventEmitter<Breadcrumb[]>(false)

  private breadcrumbs: Breadcrumb[] = []

  constructor(private router: Router) {
    this.router.events.subscribe((routeEvent) => { this.onRouteEvent(routeEvent) })
  }

  onRouteEvent(routeEvent: Event) {
    if (!(routeEvent instanceof NavigationEnd)) { return }

    // Get the parent route snapshot
    let route = this.router.routerState.root.snapshot
    let url = ''

    const newCrumbs = []

    while (route.firstChild != null) {
      route = route.firstChild

      if (route.routeConfig === null) { continue }
      if (!route.routeConfig.path) { continue }

      url += `/${this.createUrl(route)}`

      // check until the routes contains title defined in it
      if (!route.data['breadcrumb']) { continue }

      const newCrumb = this.createBreadcrumb(route, url)
      newCrumbs.push(newCrumb)
    }

    // reassign breadcrumb list with new breadcrumb list
    this.breadcrumbs = newCrumbs
    this.breadcrumbChanged.emit(this.breadcrumbs)
  }

  createBreadcrumb(route: ActivatedRouteSnapshot, url: string): Breadcrumb {
    return {
      displayName: route.data['breadcrumb'],
      url: url,
      route: route.routeConfig
    }
  }

  createUrl(route: any) {
    return route && route.url.map(function (s: any) { return s.toString() }).join('/')
  }
}