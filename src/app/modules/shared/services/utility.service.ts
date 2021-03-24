import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ISelectListItem } from '../types/select-list-item';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor() {}

  languages$(): Observable<ISelectListItem[]> {
    return of([
      {
        text: 'English',
        value: 'english',
      },
      {
        text: '日本語',
        value: 'japanese',
      },
      {
        text: 'Español',
        value: 'spanish',
      },
      {
        text: '中文(简体)',
        value: 'simplified chinese',
      },
      {
        text: '中文(繁體)',
        value: 'traditional chinese',
      },
      {
        text: 'Français',
        value: 'french',
      },
      {
        text: 'Italiano',
        value: 'italian',
      },
      {
        text: '한국어',
        value: 'korean',
      },
      {
        text: 'Čeština',
        value: 'czech',
      },
      {
        text: 'Português',
        value: 'portuguese',
      },
    ]);
  }
}
