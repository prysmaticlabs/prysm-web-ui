import { async, TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthenticationService;
  const router = {
    navigate: jasmine.createSpy('navigate')
  };
  const authMock = { login: () => {} };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        {
          provide: AuthenticationService,
          useValue: authMock,
        },
        {
          provide: Router,
          useValue: router,
        }
      ],
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthenticationService);
    router.navigate.and.callFake(() => {});
  });

  describe('canActivate', () => {
    const routeMock: any = { snapshot: {} };
    const routeStateMock: any = { snapshot: {}, url: '/'};

    it('should return true for a logged in user', () => {
      authService.token = 'hello';
      expect(guard.canActivate(routeMock, routeStateMock)).toEqual(true);
    });

    it('should return false for an unauthenticated user', () => {
      authService.token = '';
      expect(guard.canActivate(routeMock, routeStateMock)).toEqual(false);
    });
  });
});
