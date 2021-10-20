import { ErrorHandler, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HasUsedWebResponse } from 'src/app/proto/validator/accounts/v2/web_api';
import { AuthenticationService } from '../services/authentication.service';

import { LANDING_URL } from '../../core/constants';
import { ONBOARDING_URL } from '../../core/constants';

@Injectable({
    providedIn: 'root'
})
export class HasWalletGuard implements CanActivate {
    constructor(
        private authenticationService: AuthenticationService,
        private router: Router,
        private globalErrorHandler: ErrorHandler) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean | UrlTree {
        return this.authenticationService.checkHasUsedWeb().pipe(
            map((res: HasUsedWebResponse) => {
                const urlSegment = route.url[0];
                const urlCases = [
                    {path: ONBOARDING_URL, hasWallet: true, result: this.router.parseUrl(LANDING_URL)},
                    {path: ONBOARDING_URL, hasWallet: false, result: true},
                    {path: LANDING_URL, hasWallet: true, result: true},
                    {path: LANDING_URL, hasWallet: false, result: this.router.parseUrl(ONBOARDING_URL)}
                ];
                const foundUrlCase = urlCases.find((urlCase) => {
                    return urlCase.path === urlSegment.path && urlCase.hasWallet === res.hasWallet;
                });
                return foundUrlCase ? foundUrlCase.result : false;
            }),
            catchError((error) => {
                console.log('Intialize API Error: ', error);
                this.globalErrorHandler.handleError(error);
                return Promise.resolve(false);
            }));
    }


}
