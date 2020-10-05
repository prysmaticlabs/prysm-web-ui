import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';

import { NoWalletFoundGuard } from './nowalletfound.guard';
import { WalletService } from '../services/wallet.service';
import { HasWalletResponse } from 'src/app/proto/validator/accounts/v2/web_api';

class MockActivatedRouteSnapshot {}

class MockRouterStateSnapshot {
  url = '/';
}

describe('NoWalletFoundGuard', () => {
  let guard: NoWalletFoundGuard;
  let service: WalletService;
  let router: Router;
  let next: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    const serviceSpy = jasmine.createSpyObj('WalletService', ['walletExists$']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    TestBed.configureTestingModule({
      providers: [
        NoWalletFoundGuard,
        { provide: WalletService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRouteSnapshot, useValue: MockActivatedRouteSnapshot },
        { provide: RouterStateSnapshot, useValue: MockRouterStateSnapshot },
      ]
    });

    guard = TestBed.inject(NoWalletFoundGuard);
    router = TestBed.inject(Router);
    next = TestBed.inject(ActivatedRouteSnapshot);
    service = TestBed.inject(WalletService);
    state = TestBed.inject(RouterStateSnapshot);
  });

  it('should create', () => {
    expect(guard).toBeDefined();
  });

  it('should return false when the user does not have a wallet', done => {
    const resp = {
      walletExists: false,
    } as HasWalletResponse;
    service.walletExists$ = of(resp);
    guard.canActivate(next, state).subscribe(canActivate => {
      expect(canActivate).toBe(false);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/onboarding');
      done();
    });
  });

  it('should return true when the user does has a wallet', done => {
    const resp = {
      walletExists: true,
    } as HasWalletResponse;
    service.walletExists$ = of(resp);
    guard.canActivate(next, state).subscribe(canActivate => {
      expect(canActivate).toBe(true);
      expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
      done();
    });
  });
});
