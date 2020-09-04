import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { WalletService } from '../services/wallet.service';
import { WalletResponse } from 'src/app/proto/validator/accounts/v2/web_api';

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
        if (!resp.walletPath) {
          this.router.navigateByUrl('/onboarding');
          return false;
        }
        return true;
      }),
    );
  }
}
