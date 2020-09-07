import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { of } from 'rxjs';

import { ChainService } from './chain.service';
import { BeaconNodeService } from './beacon-node.service';
import { ChainHead } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { Injectable } from '@angular/core';

@Injectable()
class mockNode {
  beaconNodeEndpoint$ = of('/eth/v1alpha1');
}

describe('ChainService', () => {
  let service: ChainService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          ChainService,
          { provide: BeaconNodeService, useValue: new mockNode() },
        ]
    });
    service = TestBed.get(ChainService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should properly query the beacon endpoint for the chain head', (done) => {
    const mockResponse = {
      headEpoch: 10,
    } as ChainHead;
    service.chainHead$.subscribe(resp => {
      expect(resp).toEqual(mockResponse);
      done();
    });
    const request = httpMock.expectOne(`/eth/v1alpha1/beacon/chainhead`);
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);
  });
});