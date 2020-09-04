import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeStatusComponent } from './node-status.component';
import { BeaconNodeService } from 'src/app/modules/core/services/beacon-node.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { of } from 'rxjs';
import { NodeConnectionResponse } from 'src/app/proto/validator/accounts/v2/web_api';

describe('NodeStatusComponent', () => {
  let component: NodeStatusComponent;
  let fixture: ComponentFixture<NodeStatusComponent>;
  let service: BeaconNodeService;
  const spy = jasmine.createSpyObj('BeaconNodeService', ['conn$']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
      ],
      declarations: [ NodeStatusComponent ],
      providers: [
        { provide: BeaconNodeService, useValue: spy },
      ]
    })
    .compileComponents();
    service = TestBed.get(BeaconNodeService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeStatusComponent);
    component = fixture.componentInstance;
    service.conn$ = of({
      beaconNodeEndpoint: 'endpoint.com',
      connected: true,
      syncing: true,
    } as NodeConnectionResponse);
    component.nodeConnection$ = service.conn$;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
