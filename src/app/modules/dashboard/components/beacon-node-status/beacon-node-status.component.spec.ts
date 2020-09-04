import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { of } from 'rxjs';

import { BeaconNodeStatusComponent } from './beacon-node-status.component';
import { BeaconNodeService } from 'src/app/modules/core/services/beacon-node.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { NodeConnectionResponse } from 'src/app/proto/validator/accounts/v2/web_api';
import { MockService } from 'ng-mocks';

describe('BeaconNodeStatusComponent', () => {
  let component: BeaconNodeStatusComponent;
  let fixture: ComponentFixture<BeaconNodeStatusComponent>;
  let service: BeaconNodeService = MockService(BeaconNodeService);
  service.statusPoll$ = of({
    beaconNodeEndpoint: 'endpoint.com',
    connected: true,
    syncing: true,
  } as NodeConnectionResponse);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
      ],
      declarations: [ BeaconNodeStatusComponent ],
      providers: [
        { provide: BeaconNodeService, useValue: service },
      ]
    })
    .compileComponents();
    service = TestBed.get(BeaconNodeService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeaconNodeStatusComponent);
    component = fixture.componentInstance;
    component.nodeConnection$ = service.statusPoll$;
    fixture.detectChanges();
  });

  it('it should display different pulsating circles based on connection status', () => {
    let circle = fixture.debugElement.query(By.css('.pulsating-circle.green'));
    expect(circle.nativeElement).toBeTruthy();
    component.nodeConnection$ = of({
      beaconNodeEndpoint: 'endpoint.com',
      connected: false,
      syncing: true,
    } as NodeConnectionResponse);
    fixture.detectChanges();
    circle = fixture.debugElement.query(By.css('.pulsating-circle.red'));
    expect(circle.nativeElement).toBeTruthy();
  });

  it('it should display different message based on connection status', () => {
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Connected');
    component.nodeConnection$ = of({
      beaconNodeEndpoint: 'endpoint.com',
      connected: false,
      syncing: true,
    } as NodeConnectionResponse);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Not Connected');
  });
  
  it('it should display sync process bar if synchronizing', () => {
    let bar = fixture.debugElement.query(By.css('.mat-progress-bar'));
    expect(bar.nativeElement).toBeTruthy();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Syncing to chain head');
    component.nodeConnection$ = of({
      beaconNodeEndpoint: 'endpoint.com',
      connected: true,
      syncing: false,
    } as NodeConnectionResponse);
    fixture.detectChanges();
    bar = fixture.debugElement.query(By.css('.mat-progress-bar'));
    expect(bar).toBeNull();
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('Syncing to chain head');
  });

  it('it should only display sync process bar if connected', () => {
    component.nodeConnection$ = of({
      beaconNodeEndpoint: 'endpoint.com',
      connected: false,
      syncing: true,
    } as NodeConnectionResponse);
    fixture.detectChanges();
    const bar = fixture.debugElement.query(By.css('.mat-progress-bar'));
    expect(bar).toBeNull();
  });
});
