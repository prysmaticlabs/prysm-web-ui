import { ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
export abstract class SpecMockProvider {
  static activatedRouteMock(
    url: UrlSegment[] = [],
    queryParams?: any,
    params?: any
  ): ActivatedRouteSnapshot {
    return {
      url : (url),
      params: (params),
      queryParams: (queryParams),
      fragment: '',
      data: {},
      outlet: '',
      component: '',
      routeConfig: {},
      root: new ActivatedRouteSnapshot(),
      parent: null,
      children: [],
      firstChild: null,
      pathFromRoot: [],
      paramMap: {
        get: () => '',
        getAll: () => [],
        has: (str: string) => false,
        keys: [],
      },
      queryParamMap: {
        get: () => '',
        getAll: () => [],
        has: (str: string) => false,
        keys: [],
      },
    };
  }
}
