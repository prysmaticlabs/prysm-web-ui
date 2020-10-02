import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Event, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  routeChanged$ = new BehaviorSubject<ActivatedRouteSnapshot>({} as ActivatedRouteSnapshot);
  constructor() {
  }
}
