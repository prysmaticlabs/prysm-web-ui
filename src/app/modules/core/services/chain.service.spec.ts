import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { of } from 'rxjs';

import { ChainService } from './chain.service';
import { BeaconNodeService } from './beacon-node.service';
import { ValidatorParticipationResponse } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { Injectable } from '@angular/core';

@Injectable()
class MockNode {
  nodeEndpoint$ = of('/eth/v1alpha1');
}

describe('ChainService', () => {
  let service: ChainService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          ChainService,
          { provide: BeaconNodeService, useValue: new MockNode() }
        ]
    });
    service = TestBed.inject(ChainService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should properly query the beacon endpoint for participation', (done) => {
    const mockResponse = {
    } as ValidatorParticipationResponse;
    service.participation$.subscribe(resp => {
      expect(resp).toEqual(mockResponse);
      done();
    });
    const request = httpMock.expectOne(`/eth/v1alpha1/validators/participation`);
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);
  });
});
