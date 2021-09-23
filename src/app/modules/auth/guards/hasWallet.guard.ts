import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { HasUsedWebResponse } from 'src/app/proto/validator/accounts/v2/web_api';
import { url } from 'inspector';

@Injectable({
    providedIn: 'root'
})
export class HasWalletGuard implements CanActivate {
    constructor(private authenticationService: AuthenticationService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authenticationService.checkHasUsedWeb().pipe(
            map((res: HasUsedWebResponse) => {
                console.log('walletguard working', route)
                let urlCases: { [key: string]: (router: Router) => true | UrlTree } = {
                    'onboarding': function(router:Router) {
                        if (!res.hasWallet) {
                            return true;
                        }
                        else {
                            return router.parseUrl('/dashboard');
                        }
                    },
                    'dashboard': function(router:Router) {
                        if (!res.hasWallet) {
                            return router.parseUrl('/onboarding');
                        }
                        else {
                            return true;
                        }
                    }
                }
                let urlSegment = route.url[0];
                return urlCases[urlSegment.path](this.router);
            }));
    }

    
}
