import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  UrlTree, 
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { WalletService, WalletResponse } from '../services/wallet.service';

@Injectable({ providedIn: 'root' })
export class NoWalletFoundGuard implements CanActivate {
  constructor(
    private walletService: WalletService,
    private router: Router,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.walletService.walletConfig$.pipe(
      map((resp: WalletResponse) => {
        // If the user does not have a wallet, we redirect 
        // them to the onboarding page.
        if (resp.walletPath === undefined || resp.walletPath === '') {
          this.router.navigateByUrl('/onboarding');
          return false;
        }
        return true;
      }),
    );
  }
}
