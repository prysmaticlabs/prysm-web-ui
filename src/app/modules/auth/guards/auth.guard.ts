import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthenticationService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean | UrlTree {
        const accessToken = this.authService.getToken();
        const accessTokenExpiration = this.authService.getTokenExpiration();
        // validate if user is authenticated and if the token expiration exists
        if (!accessToken || !accessTokenExpiration || !this.validateAccessTokenExpiration(accessTokenExpiration)){
            return this.router.parseUrl('/initialize');
        } else {
            return true;
        }
    }

    private validateAccessTokenExpiration(tokenExpiration: number): boolean{
        // logic should be added here for checking token expiration
        return true;
    }
}
