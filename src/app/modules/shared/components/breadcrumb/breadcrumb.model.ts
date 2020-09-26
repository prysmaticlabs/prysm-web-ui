import { Route } from '@angular/router'

export class Breadcrumb {
    constructor(
      public displayName: string, 
      public url: string, 
      public route: Route | null) {}
}
