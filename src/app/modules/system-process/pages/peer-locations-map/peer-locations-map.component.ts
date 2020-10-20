import { Component, OnInit } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { GeoCoordinate, GeoLocatorService } from '../../../core/services/geo-locator.service';
import { IL, ILIcon, ILMap, ILMarker, LIconConfig, LMarkerConfig, LTileLayerConfig } from 'third_party/leaflet/leaflet';
declare let L: IL;

@Component({
  selector: 'app-peer-locations-map',
  templateUrl: './peer-locations-map.component.html'
})
export class PeerLocationsMapComponent implements OnInit {

  constructor(
    private geoLocationService: GeoLocatorService
  ) { }

  ngOnInit(): void {
    const locationMap: ILMap = L.map('peer-locations-map').setView([48, 32], 2.6);
    const mapIcon: ILIcon = L.icon(new LIconConfig('https://prysmaticlabs.com/assets/Prysm.svg', [30, 60]));

    this.geoLocationService.getPeerCoordinates().pipe(
      tap(geoCoordnates => {
        if (geoCoordnates) {
          const cityMarker: { [id: string]: ILMarker; } = {};
          const cityCounter: { [id: string]: number; } = {};
          geoCoordnates.forEach((coord: GeoCoordinate) => {
            if (!cityCounter[coord.city]) {
              cityCounter[coord.city] = 1;
              cityMarker[coord.city] = L.marker([coord.lat, coord.lon], new LMarkerConfig(mapIcon));
              cityMarker[coord.city].bindTooltip(coord.city).addTo(locationMap);
            }
            else {
              cityCounter[coord.city]++;
              cityMarker[coord.city].bindTooltip(coord.city + ' *' + cityCounter[coord.city]);
            }
          });
        }
      }),
      take(1)
    ).subscribe();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', new LTileLayerConfig('© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors')).addTo(locationMap);
  }

}
