import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthenticationService, AuthResponse } from './auth.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [AuthenticationService]
    });
    service = TestBed.get(AuthenticationService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be able to authenticate and set a token on completion', () => {
    const mockResponse: AuthResponse = {
      token: 'eth2',
    };
    service.login('password').subscribe(resp => {
      // Check the token in the response.
      expect(resp.token).toEqual(mockResponse.token);
      // Expect the token property of the service has been set
      // to the token in the response.
      expect(service.token).toEqual(resp.token);
    });
    const request = httpMock.expectOne('/api/login');
    expect(request.request.method).toBe('POST');
    request.flush(mockResponse);
  });
});