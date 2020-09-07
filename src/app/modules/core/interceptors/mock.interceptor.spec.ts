import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { MockInterceptor, VALIDATOR_API_SUFFIX, BEACON_API_SUFFIX } from './mock.interceptor';
import { EnvironmenterService } from '../services/environmenter.service';
import { Mocks } from '../mocks';

class mockEnv {
  env = { production: false };
}

describe('MockInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MockInterceptor,
          multi: true
        },
        {
          provide: EnvironmenterService, useValue: new mockEnv(),
        },
      ]
    });
  });

  describe('intercept HTTP requests', () => {
    it('should retrieve a mock for the validator API calls', inject([HttpClient, HttpTestingController],
      (http: HttpClient, mock: HttpTestingController) => {
        const endpoint = VALIDATOR_API_SUFFIX + '/login';
        http.get(endpoint).subscribe((res) => {
          expect(res).toEqual(Mocks[endpoint]);
        });
        mock.verify();
      })
    );
  });
});
