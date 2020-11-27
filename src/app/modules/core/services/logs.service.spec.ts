import { TestBed } from '@angular/core/testing';
import { EnvironmenterService } from './environmenter.service';

import { LogsService } from './logs.service';

describe('LogsService', () => {
  let service: LogsService;

  beforeEach(() => {
    const envSpy = jasmine.createSpyObj('EnvironmenterService', ['env']);
    TestBed.configureTestingModule({
      providers: [
        { provide: EnvironmenterService, useValue: envSpy },
      ]
    });
    service = TestBed.inject(LogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
