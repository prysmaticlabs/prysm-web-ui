import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { MockInterceptor} from './mock.interceptor';
import { EnvironmenterService } from '../services/environmenter.service';

class MockEnv {
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
          provide: EnvironmenterService, useValue: new MockEnv(),
        },
      ]
    });
  });
});
