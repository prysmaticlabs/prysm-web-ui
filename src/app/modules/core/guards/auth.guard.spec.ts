import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthenticationService } from '../services/auth.service';

class MockActivatedRouteSnapshot {}

class MockRouterStateSnapshot {
  url: string = '/';
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthenticationService;
  let router: Router;
  let next: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const serviceSpy = jasmine.createSpyObj('AuthenticationService', ['login']);
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthenticationService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRouteSnapshot, useValue: MockActivatedRouteSnapshot },
        { provide: RouterStateSnapshot, useValue: MockRouterStateSnapshot },
      ],
    });
    router = TestBed.inject(Router);
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthenticationService);
    next = TestBed.inject(ActivatedRouteSnapshot);
    state = TestBed.inject(RouterStateSnapshot);
  });

  describe('canActivate', () => {
    it('should return true for a logged in user', () => {
      authService.token = 'hello';
      expect(guard.canActivate(next, state)).toEqual(true);
    });

    it('should return false for an unauthenticated user', () => {
      authService.token = '';
      expect(guard.canActivate(next, state)).toEqual(false);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
