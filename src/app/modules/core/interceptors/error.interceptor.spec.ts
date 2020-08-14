import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { ErrorInterceptor } from './error.interceptor';
import { AuthenticationService } from '../services/auth.service';

describe('ErrorInterceptor', () => {
  let authService: AuthenticationService;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthenticationService', ['logout']);
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true
        },
        { provide: AuthenticationService, useValue: spy },
      ]
    });
    authService = TestBed.inject(AuthenticationService);
    authService.logout = jasmine.createSpy('logout');
  });

  describe('intercept HTTP requests', () => {
    it('should logout user upon 401 response', inject([HttpClient, HttpTestingController],
      (http: HttpClient, mock: HttpTestingController) => {
        http.get('/').subscribe({
          error(actualError) {
            expect(actualError).toBeTruthy();
            expect(actualError).not.toBeNull();
            expect(actualError).not.toBeUndefined();
          },
        });

        const req = mock.expectOne('/');
        expect(req.request.method).toEqual('GET');

        req.flush({ errorMessage: 'Oh no' }, { status: 401, statusText: 'Unauthorized' });
        mock.verify();
        expect(authService.logout).toHaveBeenCalled();
      })
    );

    it('should not logout user if response is != 401', inject([HttpClient, HttpTestingController],
      (http: HttpClient, mock: HttpTestingController) => {
        http.get('/').subscribe({
          error(actualError) {
            expect(actualError).toBeTruthy();
            expect(actualError).not.toBeNull();
            expect(actualError).not.toBeUndefined();
          },
        });

        const req = mock.expectOne('/');
        expect(req.request.method).toEqual('GET');

        req.flush({ errorMessage: 'Oh no' }, { status: 500, statusText: 'Internal Server Error' });
        mock.verify();
        expect(authService.logout).not.toHaveBeenCalled();
      })
    );
  });
});
