import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BeaconNodeService } from './beacon-node.service';
import { EnvironmenterService } from './environmenter.service';

describe('BeaconNodeService', () => {
  const envSpy = jasmine.createSpyObj('EnvironmenterService', ['env']);
  let service: BeaconNodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        { provide: EnvironmenterService, useValue: envSpy },
      ]
    });
    service = TestBed.inject(BeaconNodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
