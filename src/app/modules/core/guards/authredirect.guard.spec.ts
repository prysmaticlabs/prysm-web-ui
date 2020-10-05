import { AuthredirectGuard } from './authredirect.guard';
import { AuthenticationService } from '../services/authentication.service';
import { TestBed, async } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

class MockActivatedRouteSnapshot {}

class MockRouterStateSnapshot {
  url = '/';
}

describe('AuthredirectGuard', () => {
  let authredirectGuard: AuthredirectGuard;
  let authService: AuthenticationService;
  let route: ActivatedRouteSnapshot;
  let router: Router;
  let state: RouterStateSnapshot;

  beforeEach(async(() => {
    const serviceSpy = jasmine.createSpyObj('AuthenticationService', ['token']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthenticationService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRouteSnapshot, useValue: MockActivatedRouteSnapshot },
        { provide: RouterStateSnapshot, useValue: MockRouterStateSnapshot },
      ],
    })
      .compileComponents();
    authredirectGuard = TestBed.inject(AuthredirectGuard);
    authService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRouteSnapshot);
    state = TestBed.inject(RouterStateSnapshot);
  }));

  describe('canActivate', () => {
    it('should return false for a logged in user', () => {
      authService.token = 'token';
      expect(authredirectGuard.canActivate(route, state)).toEqual(false);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/gains-and-losses']);
    });

    it('should return true for an unauthenticated user', () => {
      authService.token = '';
      expect(authredirectGuard.canActivate(route, state)).toEqual(true);
    });
  });
});
