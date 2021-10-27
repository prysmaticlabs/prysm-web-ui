import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EnvironmenterService } from '../../core/services/environmenter.service';
import { AuthenticationService } from './authentication.service';

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
          { provide: EnvironmenterService, useValue: serviceSpy }
        ]
    });
    environmenter = TestBed.inject(EnvironmenterService);
    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
