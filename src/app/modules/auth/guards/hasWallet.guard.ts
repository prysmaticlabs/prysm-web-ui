import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HasUsedWebResponse } from 'src/app/proto/validator/accounts/v2/web_api';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class HasWalletGuard implements CanActivate {
    constructor(private authenticationService: AuthenticationService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean | UrlTree {
        return this.authenticationService.checkHasUsedWeb().pipe(
            map((res: HasUsedWebResponse) => {
                const urlSegment = route.url[0];
                const urlCases = [
                    {path: 'onboarding', hasWallet: true, result: this.router.parseUrl('/dashboard')},
                    {path: 'onboarding', hasWallet: false, result: true},
                    {path: 'dashboard', hasWallet: true, result: true},
                    {path: 'dashboard', hasWallet: false, result: this.router.parseUrl('/onboarding')}
                ];
                const foundUrlCase = urlCases.find((urlCase) => {
                    return urlCase.path === urlSegment.path && urlCase.hasWallet === res.hasWallet;
                });
                return foundUrlCase ? foundUrlCase.result : false;
            }));
    }


}
