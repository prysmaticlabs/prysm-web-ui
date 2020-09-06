import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Observable, of } from 'rxjs';

import { BeaconNodeStatusComponent } from './beacon-node-status.component';
import { BeaconNodeService } from 'src/app/modules/core/services/beacon-node.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { NodeConnectionResponse } from 'src/app/proto/validator/accounts/v2/web_api';
import { MockService } from 'ng-mocks';
import { Store } from '../../../core/utils/simple-store';
import { tap } from 'rxjs/operators';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EnvironmenterService } from '../../../core/services/environmenter.service';
import { HttpClient } from '@angular/common/http';
import { select$ } from '../../../core/utils/select$';

describe('BeaconNodeStatusComponent', () => {
  let component: BeaconNodeStatusComponent;
  let fixture: ComponentFixture<BeaconNodeStatusComponent>;
  let service: BeaconNodeService = MockService(BeaconNodeService);
  let beaconNodeState$ = new Store({} as NodeConnectionResponse);
  (service as any)["beaconNodeState$"] = beaconNodeState$;
  beaconNodeState$.next({
    beaconNodeEndpoint: "endpoint",
    connected: true,
    syncing: true
  } as NodeConnectionResponse);
  let beaconNodeConnected$: Observable<boolean> = select$(
    beaconNodeState$,
    res => res.connected,
  );
  let beaconNodeEndPoint$: Observable<string> = select$(
    beaconNodeState$,
    res => res.beaconNodeEndpoint,
  );
  let syncing$: Observable<boolean> = select$(
    beaconNodeState$,
    res => res.syncing,
  );

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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeaconNodeStatusComponent);
    component = fixture.componentInstance;
    component.endpoint$ = beaconNodeEndPoint$;
    component.connected$ = beaconNodeConnected$;
    component.syncing$ = syncing$;
    fixture.detectChanges();
  });

  it('it should display different pulsating circles based on connection status', () => {
    beaconNodeState$.next({
      beaconNodeEndpoint: "endpoint",
      connected: true,
      syncing: true
    } as NodeConnectionResponse);
    fixture.detectChanges();
    let circle = fixture.debugElement.query(By.css('.pulsating-circle.green'));
    expect(circle.nativeElement).toBeTruthy();

    beaconNodeState$.next({
      beaconNodeEndpoint: "endpoint",
      connected: false,
      syncing: true
    } as NodeConnectionResponse);
    fixture.detectChanges();
    circle = fixture.debugElement.query(By.css('.pulsating-circle.red'));
    expect(circle.nativeElement).toBeTruthy();
  });

  it('it should display different message based on connection status', () => {
    beaconNodeState$.next({
      beaconNodeEndpoint: "endpoint",
      connected: true,
      syncing: true
    } as NodeConnectionResponse);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Connected');
    beaconNodeState$.next({
      beaconNodeEndpoint: "endpoint",
      connected: false,
      syncing: true
    } as NodeConnectionResponse);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Not Connected');
  });
  
  it('it should display sync process bar if synchronizing', () => {
    beaconNodeState$.next({
      beaconNodeEndpoint: "endpoint",
      connected: true,
      syncing: true
    } as NodeConnectionResponse);
    fixture.detectChanges();
    let bar = fixture.debugElement.query(By.css('.mat-progress-bar'));
    expect(bar.nativeElement).toBeTruthy();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Syncing to chain head');
    beaconNodeState$.next({
      beaconNodeEndpoint: "endpoint",
      connected: true,
      syncing: false
    } as NodeConnectionResponse);
    fixture.detectChanges();
    bar = fixture.debugElement.query(By.css('.mat-progress-bar'));
    expect(bar).toBeNull();
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('Syncing to chain head');
  });

  it('it should only display sync process bar if connected', () => {
    beaconNodeState$.next({
      beaconNodeEndpoint: "endpoint",
      connected: true,
      syncing: false
    } as NodeConnectionResponse);
    fixture.detectChanges();
    const bar = fixture.debugElement.query(By.css('.mat-progress-bar'));
    expect(bar).toBeNull();
  });
});
