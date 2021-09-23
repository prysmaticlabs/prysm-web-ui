import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { JwtInterceptor } from './jwt.interceptor';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent, MockService } from 'ng-mocks';

describe('JwtInterceptor', () => {
  let authService: AuthenticationService;

  beforeEach(() => {
    authService = MockService(AuthenticationService);
   
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true
        },
        {
          provide: AuthenticationService, useValue: authService,
        },
      ]
    });
    authService = TestBed.inject(AuthenticationService);
  });

  describe('intercept HTTP requests', () => {

    it('should include authorization headers if user is logged in', inject([HttpClient, HttpTestingController],
      (http: HttpClient, mock: HttpTestingController) => {
        authService.getToken = () =>{
          return 'hello'
        };
        http.get('/').subscribe(
          response => {
            expect(response).toBeTruthy();
          }
        );

        const req = mock.expectOne(r =>
          r.headers.has('Authorization') &&
          r.headers.get('Authorization') === `Bearer hello`,
        );
        expect(req.request.method).toEqual('GET');

        req.flush({ hello: 'world' });
        mock.verify();
      })
    );

    it('should not include authorization headers if no token found', inject([HttpClient, HttpTestingController],
      (http: HttpClient, mock: HttpTestingController) => {
        http.get('/').subscribe(
          response => {
            expect(response).toBeTruthy();
          }
        );

        const req = mock.expectOne(r => !r.headers.has('Authorization'));
        expect(req.request.method).toEqual('GET');

        req.flush({ hello: 'world' });
        mock.verify();
      })
    );
  });
});
