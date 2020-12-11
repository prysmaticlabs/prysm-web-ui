import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  UrlTree,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';
import { EnvironmenterService } from '../services/environmenter.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private environmenter: EnvironmenterService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<boolean|UrlTree> | boolean {
    const isDev = !this.environmenter.env.production;
    if (this.authenticationService.token || isDev) {
      return true;
    }

    if (state.url) {
      this.router.navigate(['/login'],  {
        queryParams: {
          returnUrl: state.url
        }
      });
    } else {
      this.router.navigate(['/login']);
    }

    return false;
  }
}
