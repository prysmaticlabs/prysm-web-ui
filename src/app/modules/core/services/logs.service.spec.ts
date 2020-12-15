import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ENVIRONMENT } from 'src/environments/token';

import { LogsService } from './logs.service';

describe('LogsService', () => {
  let service: LogsService;

  beforeEach(() => {
    const envSpy = jasmine.createSpyObj('EnvironmenterService', ['env']);
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: ENVIRONMENT, useValue: jasmine.createSpyObj('EnvironmenterService', ['env']) },
      ]
    });
    service = TestBed.inject(LogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
