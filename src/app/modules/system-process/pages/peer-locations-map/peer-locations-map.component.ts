import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { GeoCoordinate, GeoLocatorService } from '../../../core/services/geo-locator.service';
declare let L: any;

@Component({
  selector: 'app-peer-locations-map',
  templateUrl: './peer-locations-map.component.html'
})
export class PeerLocationsMapComponent implements OnInit {

  constructor(
    private geoLocationService: GeoLocatorService
  ) { }

  ngOnInit(): void {
    const locationMap = L.map('peer-locations-map').setView([48, 32], 2.6);
    const mapIcon: any = L.icon({
      iconUrl: 'https://prysmaticlabs.com/assets/Prysm.svg',
      iconSize: [30, 60]
    });

    this.geoLocationService.getPeerCoordinates().pipe(
      take(1)
    ).subscribe(geoCoordnates => {
      if (geoCoordnates) {
        const cityMarker: any = {};
        const cityCounter: any = {};
        geoCoordnates.forEach((coord: GeoCoordinate) => {
          if (!cityCounter[coord.city]) {
            cityCounter[coord.city] = 1;
            cityMarker[coord.city] = L.marker([coord.lat, coord.lon], {
              icon: mapIcon
            });
            cityMarker[coord.city].bindTooltip(coord.city).addTo(locationMap);
          }
          else {
            cityCounter[coord.city]++;
            cityMarker[coord.city].bindTooltip(coord.city + ' *' + cityCounter[coord.city]);
          }
        });
      }
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(locationMap);
  }

}
