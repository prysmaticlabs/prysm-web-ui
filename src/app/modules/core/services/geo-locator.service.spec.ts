import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmenterService } from './environmenter.service';

import { GeoLocatorService } from './geo-locator.service';

describe('GeoLocatorService', () => {
  const envSpy = jasmine.createSpyObj('EnvironmenterService', ['env']);
  let service: GeoLocatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        { provide: EnvironmenterService, useValue: envSpy },
      ]
    });
    service = TestBed.inject(GeoLocatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
