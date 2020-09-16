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

// This redirect guard prevents users from visiting the login page by default
// if they are authenticated and instead redirects them to the dashboard.
@Injectable({ providedIn: 'root' })
export class AuthredirectGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<boolean|UrlTree> | boolean{
    if (this.authenticationService.token) {
      this.router.navigate(['/dashboard/gains-and-losses']);
      return false;
    }
    return true;
  }
}
