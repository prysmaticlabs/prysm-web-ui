import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRouteSnapshot } from '@angular/router';
import { MockService } from 'ng-mocks';
import { Observable, of } from 'rxjs';
import { EventsService } from 'src/app/modules/core/services/events.service';
import { Breadcrumb, BreadcrumbService } from '../../services/breadcrumb.service';

import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let service: BreadcrumbService = MockService(BreadcrumbService);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatIconModule ],
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
      return of([
        {
          displayName: 'hello',
          url: 'dashboard',
        }
      ] as Breadcrumb[]);
    };
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const text = (fixture.nativeElement as HTMLElement).textContent;
    console.log(text);
  });
});
