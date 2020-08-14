import { AuthredirectGuard } from './authredirect.guard';
import { AuthenticationService } from '../services/auth.service';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { 
  GainsAndLossesComponent,
} from '../../dashboard/pages/gains-and-losses/gains-and-losses.component';

class MockActivatedRouteSnapshot {
  private _data: any;
  get data() {
    return this._data;
  }
}

class MockRouterStateSnapshot {
  url: string = '/';
}

describe('AuthredirectGuard', () => {
  let authredirectGuard: AuthredirectGuard;
  let authService: AuthenticationService;
  let route: ActivatedRouteSnapshot;
  let router: Router;
  let state: RouterStateSnapshot;

  beforeEach(async(() => {
    const spy = jasmine.createSpyObj('AuthenticationService', ['token']);
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'dashboard/gains-and-losses', component: GainsAndLossesComponent },
        ]),
      ],
      providers: [
        AuthGuard,
        { provide: AuthenticationService, useValue: spy },
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
      spyOn(router, 'navigate');
      expect(authredirectGuard.canActivate(route, state)).toEqual(false);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/gains-and-losses']);
    });

    it('should return true for an unauthenticated user', () => {
      authService.token = '';
      expect(authredirectGuard.canActivate(route, state)).toEqual(true);
    });
  });
});
