import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { of } from 'rxjs';

import { BeaconNodeStatusComponent } from './beacon-node-status.component';
import { BeaconNodeService, BeaconNodeState } from 'src/app/modules/core/services/beacon-node.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { NodeConnectionResponse } from 'src/app/proto/validator/accounts/v2/web_api';
import { MockService } from 'ng-mocks';

describe('BeaconNodeStatusComponent', () => {
  let component: BeaconNodeStatusComponent;
  let fixture: ComponentFixture<BeaconNodeStatusComponent>;
  let service: BeaconNodeService = MockService(BeaconNodeService);
  service.beaconNodeState = new BeaconNodeState();
  service.beaconNodeState.beaconNodeEndpoint$.next('endpoint.com');
  service.beaconNodeState.connected$.next(true);
  service.beaconNodeState.syncing$.next(true);

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
    component.beaconNodeState = service.beaconNodeState;
    fixture.detectChanges();
  });

  it('it should display different pulsating circles based on connection status', () => {
    service.beaconNodeState.beaconNodeEndpoint$.next('endpoint.com');
    service.beaconNodeState.connected$.next(true);
    service.beaconNodeState.syncing$.next(true);
    fixture.detectChanges();
    let circle = fixture.debugElement.query(By.css('.pulsating-circle.green'));
    expect(circle.nativeElement).toBeTruthy();

    service.beaconNodeState.beaconNodeEndpoint$.next('endpoint.com');
    service.beaconNodeState.connected$.next(false);
    service.beaconNodeState.syncing$.next(true);
    fixture.detectChanges();
    circle = fixture.debugElement.query(By.css('.pulsating-circle.red'));
    expect(circle.nativeElement).toBeTruthy();
  });

  it('it should display different message based on connection status', () => {
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Connected');
    service.beaconNodeState.beaconNodeEndpoint$.next('endpoint.com');
    service.beaconNodeState.connected$.next(false);
    service.beaconNodeState.syncing$.next(true);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Not Connected');
  });
  
  it('it should display sync process bar if synchronizing', () => {
    service.beaconNodeState.beaconNodeEndpoint$.next('endpoint.com');
    service.beaconNodeState.connected$.next(true);
    service.beaconNodeState.syncing$.next(true);
    fixture.detectChanges();
    let bar = fixture.debugElement.query(By.css('.mat-progress-bar'));
    expect(bar.nativeElement).toBeTruthy();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Syncing to chain head');
    service.beaconNodeState.beaconNodeEndpoint$.next('endpoint.com');
    service.beaconNodeState.connected$.next(true);
    service.beaconNodeState.syncing$.next(false);
    fixture.detectChanges();
    bar = fixture.debugElement.query(By.css('.mat-progress-bar'));
    expect(bar).toBeNull();
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('Syncing to chain head');
  });

  it('it should only display sync process bar if connected', () => {
    service.beaconNodeState.beaconNodeEndpoint$.next('endpoint.com');
    service.beaconNodeState.connected$.next(false);
    service.beaconNodeState.syncing$.next(true);
    fixture.detectChanges();
    const bar = fixture.debugElement.query(By.css('.mat-progress-bar'));
    expect(bar).toBeNull();
  });
});
