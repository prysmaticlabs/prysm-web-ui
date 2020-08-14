import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  describe('canActivate', () => {
    let authGuard: AuthGuard;
    let authService;
    let routeMock: any = { snapshot: {} };
    let routeStateMock: any = { snapshot: {}, url: '/'};

    it('should return true for a logged in user', () => {
      authService = { token: 'hello', login: () => {}};
      authGuard = new AuthGuard(authService);
      expect(authGuard.canActivate(routeMock, routeStateMock)).toEqual(true);
    });

    it('should return false for an unauthenticated user', () => {
      authService = { token: '', login: () => {}};
      authGuard = new AuthGuard(authService);
      expect(authGuard.canActivate(routeMock, routeStateMock)).toEqual(false);
    });
  });
});
