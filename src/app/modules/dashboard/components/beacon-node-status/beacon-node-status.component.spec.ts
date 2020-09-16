import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { of } from 'rxjs';

import { BeaconNodeStatusComponent } from './beacon-node-status.component';
import { BeaconNodeService } from 'src/app/modules/core/services/beacon-node.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { MockService } from 'ng-mocks';
import { CommonModule } from '@angular/common';
import { ChainHead } from 'src/app/proto/eth/v1alpha1/beacon_chain';

describe('BeaconNodeStatusComponent', () => {
  let component: BeaconNodeStatusComponent;
  let fixture: ComponentFixture<BeaconNodeStatusComponent>;
  let service: BeaconNodeService = MockService(BeaconNodeService);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        SharedModule,
      ],
      declarations: [ BeaconNodeStatusComponent ],
      providers: [
        { provide: BeaconNodeService, useValue: service },
      ]
    })
    .compileComponents();
    service = TestBed.inject(BeaconNodeService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeaconNodeStatusComponent);
    component = fixture.componentInstance;
    component.endpoint$ = of('endpoint.com');
    component.connected$ = of(true);
    component.syncing$ = of(true);
    fixture.detectChanges();
  });

  it('it should display different pulsating circles based on connection status', () => {
    let circle = fixture.debugElement.query(By.css('.pulsating-circle.green'));
    expect(circle.nativeElement).toBeTruthy();
    fixture.detectChanges();
    component.endpoint$ = of('endpoint.com');
    component.connected$ = of(false);
    component.syncing$ = of(true);
    fixture.detectChanges();
    circle = fixture.debugElement.query(By.css('.pulsating-circle.red'));
    expect(circle.nativeElement).toBeTruthy();
  });

  it('it should display different message based on connection status', () => {
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Connected');
    component.endpoint$ = of('endpoint.com');
    component.connected$ = of(false);
    component.syncing$ = of(true);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Not Connected');
  });

  it('it should display sync process bar if synchronizing', () => {
    let bar = fixture.debugElement.query(By.css('.mat-progress-bar'));
    expect(bar.nativeElement).toBeTruthy();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Syncing to chain head');
    component.endpoint$ = of('endpoint.com');
    component.connected$ = of(true);
    component.syncing$ = of(false);
    fixture.detectChanges();
    bar = fixture.debugElement.query(By.css('.mat-progress-bar'));
    expect(bar).toBeNull();
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('Syncing to chain head');
  });

  it('it should only display sync process bar if connected', () => {
    component.endpoint$ = of('endpoint.com');
    component.connected$ = of(false);
    component.syncing$ = of(true);
    fixture.detectChanges();
    const bar = fixture.debugElement.query(By.css('.mat-progress-bar'));
    expect(bar).toBeNull();
  });

  describe('Chain head data', () => {
    it('should display chain head information', () => {
      component.chainHead$ = of({
        headSlot: 1024,
        headEpoch: 32,
        justifiedEpoch: 31,
        finalizedEpoch: 30,
      } as ChainHead);
      fixture.detectChanges();
      const content: HTMLElement = fixture.nativeElement;
      expect(content.textContent).toContain('1024');
      expect(content.textContent).toContain('31');
      expect(content.textContent).toContain('30');
    });

    it('should display a warning if > 4 epochs since finality', () => {
      component.chainHead$ = of({
        headSlot: 1024,
        headEpoch: 32,
        justifiedEpoch: 31,
        finalizedEpoch: 20,
      } as ChainHead);
      fixture.detectChanges();
      const content: HTMLElement = fixture.nativeElement;
      expect(content.textContent).toContain('Warning');
    });
  });
});
