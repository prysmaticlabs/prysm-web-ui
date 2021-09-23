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

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authenticationService.checkHasUsedWeb().pipe(
            map((res: HasUsedWebResponse) => {
                console.log('walletguard working', route);
                const urlCases: { [key: string]: (router: Router) => true | UrlTree } = {
                    onboarding: function (router: Router) {
                        if (!res.hasWallet) {
                            return true;
                        }
                        else {
                            return router.parseUrl('/dashboard');
                        }
                    },
                    dashboard: function (router: Router){
                        if (!res.hasWallet) {
                            return router.parseUrl('/onboarding');
                        }
                        else {
                            return true;
                        }
                    }
                };
                const urlSegment = route.url[0];
                return urlCases[urlSegment.path](this.router);
            }));
    }


}
