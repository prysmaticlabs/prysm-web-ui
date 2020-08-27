import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';

import { NoWalletFoundGuard } from './nowalletfound.guard';
import { WalletService, WalletResponse } from '../services/wallet.service';
import { OnboardingComponent } from '../../onboarding/onboarding.component';

class MockActivatedRouteSnapshot {
  private _data: any;
  get data() {
    return this._data;
  }
}

class MockRouterStateSnapshot {
  url: string = '/';
}

describe('NoWalletFoundGuard', () => {

  let guard: NoWalletFoundGuard;
  let service: jasmine.SpyObj<WalletService>;
  let router: Router;
  let next: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {

    const spy = jasmine.createSpyObj('WalletService', ['walletConfig$']);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'onboarding', component: OnboardingComponent } 
        ]),
      ],
      providers: [
        NoWalletFoundGuard,
        { provide: WalletService, useValue: spy },
        { provide: ActivatedRouteSnapshot, useValue: MockActivatedRouteSnapshot },
        { provide: RouterStateSnapshot, useValue: MockRouterStateSnapshot },
      ]
    });

    guard = TestBed.get(NoWalletFoundGuard);
    service = TestBed.get(WalletService);
    router = TestBed.inject(Router);
    next = TestBed.inject(ActivatedRouteSnapshot);
    state = TestBed.inject(RouterStateSnapshot);
  });

  it('should create', () => {
    expect(guard).toBeDefined();
  });

  it('should return false when the user does not have a wallet', () => {
    const resp: WalletResponse = {
      walletPath: '',
    };
    service.walletConfig$ = of(resp);
    guard.canActivate(next, state).subscribe(canActivate => {
      expect(canActivate).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/onboarding']);
    });
  });

  it('should return true when the user does has a wallet', () => {
    const resp: WalletResponse = {
      walletPath: '/home/ubuntu/.eth2validators/prysm-wallet-v2',
    };
    service.walletConfig$ = of(resp);
    guard.canActivate(next, state).subscribe(canActivate => {
      expect(canActivate).toBe(true);
      expect(router.navigate).toHaveBeenCalledTimes(0);
    });
  });
});