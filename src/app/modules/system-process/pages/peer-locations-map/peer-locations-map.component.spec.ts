import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { GeoCoordinate, GeoLocatorService } from '../../../core/services/geo-locator.service';

import { PeerLocationsMapComponent } from './peer-locations-map.component';
declare let L: any;

describe('PeerLocationsMapComponent', () => {
  let component: PeerLocationsMapComponent;
  let fixture: ComponentFixture<PeerLocationsMapComponent>;
  const service: GeoLocatorService = MockService(GeoLocatorService);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      declarations: [PeerLocationsMapComponent],
      providers: [
        { provide: GeoLocatorService, useValue: service },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    spyOn(service, 'getPeerCoordinates').and.returnValue(of());
    fixture = TestBed.createComponent(PeerLocationsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
