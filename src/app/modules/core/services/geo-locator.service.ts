import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Peers } from '../../../proto/eth/v1alpha1/node';
import { BeaconNodeService } from './beacon-node.service';
import { GEO_COORDINATES_API } from '../../core/constants';


export interface GeoCoordinate {
  city: string;
  lon: number;
  lat: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeoLocatorService {

  constructor(
    private http: HttpClient,
    private beaconService: BeaconNodeService,
  ) { }

  // http request
  getPeerCoordinates(): Observable<GeoCoordinate[]> {
    return this.beaconService.peers$.pipe(
      map((peers: Peers) => {
        return peers.peers.map(peer => {
          return peer.address.split('/')[2];
        });
      }),
      switchMap(ips => this.http.post<GeoCoordinate[]>(GEO_COORDINATES_API, JSON.stringify(ips)))
    );
  }
}
