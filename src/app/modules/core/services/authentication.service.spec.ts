import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthenticationService } from './authentication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthRequest, AuthResponse } from 'src/app/proto/validator/accounts/v2/web_api';
import { EnvironmenterService } from './environmenter.service';
import { MatDialog } from '@angular/material/dialog';

describe('AuthenticationService', () => {
  let environmenter: EnvironmenterService;
  let service: AuthenticationService;
  let httpMock: HttpTestingController;
  const serviceSpy = jasmine.createSpyObj('EnvironmenterService', ['env']);

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          RouterTestingModule,
        ],
        providers: [
          AuthenticationService,
          { provide: EnvironmenterService, useValue: serviceSpy },
          { provide: MatDialog, useValue: {} },
        ]
    });
    environmenter = TestBed.inject(EnvironmenterService);
    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be able to authenticate and set a token on completion', () => {
    const mockResponse: AuthResponse = {
      token: 'eth2',
      tokenExpiration: 0,
    };
    const mockRequest: AuthRequest = {
      password: 'password',
      passwordConfirmation: 'password',
    };
    service.login(mockRequest).subscribe(resp => {
      // Check the token in the response.
      expect(resp.token).toEqual(mockResponse.token);
      // Expect the token property of the service has been set
      // to the token in the response.
      expect(service.shortLivedToken).toEqual(resp.token);
    });
    const request = httpMock.expectOne(`${environmenter.env.validatorEndpoint}/login`);
    expect(request.request.method).toBe('POST');
    request.flush(mockResponse);
  });
});
