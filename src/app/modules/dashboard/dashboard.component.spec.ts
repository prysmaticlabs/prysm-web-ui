import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';

import { SharedModule } from '../../modules/shared/shared.module';
import { NodeConnectionResponse } from '../../proto/validator/accounts/v2/web_api';
import { BeaconNodeService } from '../core/services/beacon-node.service';
import { Store } from '../core/utils/simple-store';
import { SidebarExpandableLinkComponent } from './components/sidebar-expandable-link/sidebar-expandable-link.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let service: BeaconNodeService = MockService(BeaconNodeService);
  let beaconNodeState$ = new Store({} as NodeConnectionResponse);
  service.nodeStatusPoll$ = of({
    beaconNodeEndpoint: "endpoint",
    connected: true,
    syncing: true
  } as NodeConnectionResponse);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedModule,
      ],
      declarations: [
        SidebarExpandableLinkComponent,
        SidebarComponent,
        DashboardComponent,
      ],
      providers: [
        { provide: BeaconNodeService, useValue: service },
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
