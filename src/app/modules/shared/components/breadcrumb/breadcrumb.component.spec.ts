import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockService } from 'ng-mocks';
import { Observable, of } from 'rxjs';
import { EventsService } from 'src/app/modules/core/services/events.service';
import { Breadcrumb, BreadcrumbService } from '../../services/breadcrumb.service';

import { BreadcrumbComponent } from './breadcrumb.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LANDING_URL } from 'src/app/modules/core/constants';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let service: BreadcrumbService = MockService(BreadcrumbService);
  const mockBreadcrumbs: Breadcrumb[] = [
    {
      displayName: 'Dashboard',
      route: { path: 'dashboard' },
      url: '/' + LANDING_URL,
    },
    {
      displayName: 'Wallet',
      route: { path: 'wallet' },
      url: '/' + LANDING_URL + '/wallet',
    },
    {
      displayName: 'Accounts',
      route: { path: 'accounts' },
      url: '/' + LANDING_URL + '/wallet/accounts',
    },
    {
      displayName: 'Create',
      route: { path: 'create' },
      url: '/' + LANDING_URL + '/wallet/accounts/create',
    },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [BreadcrumbComponent],
      providers: [
        EventsService,
        { provide: BreadcrumbService, useValue: service },
      ]
    })
    .compileComponents();
    service = TestBed.inject(BreadcrumbService);
  }));

  beforeEach(() => {
    service.create = (_: ActivatedRouteSnapshot): Observable<Breadcrumb[]> => {
      return of(mockBreadcrumbs);
    };
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the right number of breadcrumbs as list elements', () => {
    expect(component).toBeTruthy();
    const elem = fixture.nativeElement as HTMLElement;
    const listItems = elem.querySelectorAll('li');
    expect(listItems.length).toEqual(mockBreadcrumbs.length);
  });

  it('should display the correct breadcrumb hierarchy', () => {
    expect(component).toBeTruthy();
    const elem = fixture.nativeElement as HTMLElement;
    const listItems = elem.querySelectorAll('li');
    const received: string[] = [];
    for (let i = 0; i < listItems.length; i++) {
      const linkText = listItems[i].querySelector('a')?.textContent;
      if (linkText) {
        received.push(linkText.trim());
      }
    }
    const hierarchy = mockBreadcrumbs.map(b => b.displayName);
    expect(received).toEqual(hierarchy.slice(0, hierarchy.length - 1));
  });

  it('should render breadcrumb separators', () => {
    expect(component).toBeTruthy();
    const listItems = fixture.debugElement.queryAll(By.css('.separator'));
    expect(listItems.length).toEqual(mockBreadcrumbs.length - 1);
  });
});
