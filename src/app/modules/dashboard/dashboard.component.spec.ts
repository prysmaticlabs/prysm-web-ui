import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockService } from 'ng-mocks';
import { of } from 'rxjs';

import { SharedModule } from '../../modules/shared/shared.module';
import { SidebarExpandableLinkComponent } from './components/sidebar-expandable-link/sidebar-expandable-link.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './dashboard.component';
import { BeaconNodeService } from '../core/services/beacon-node.service';
import { BeaconStatusResponse } from 'src/app/proto/validator/accounts/v2/web_api';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const serviceMock = MockService(BeaconNodeService);
  (serviceMock as any)['nodeStatusPoll$'] = of({} as BeaconStatusResponse);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedModule,
      ],
      providers: [
        { provide: BeaconNodeService, useValue: serviceMock },
      ],
      declarations: [
        SidebarExpandableLinkComponent,
        SidebarComponent,
        DashboardComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
