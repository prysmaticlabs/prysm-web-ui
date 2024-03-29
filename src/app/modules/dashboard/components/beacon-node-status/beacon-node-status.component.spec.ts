import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { of } from 'rxjs';

import { BeaconNodeStatusComponent } from './beacon-node-status.component';
import { BeaconNodeService } from 'src/app/modules/core/services/beacon-node.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { MockService } from 'ng-mocks';
import { CommonModule } from '@angular/common';
import { ChainHead } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('BeaconNodeStatusComponent', () => {
  let component: BeaconNodeStatusComponent;
  let fixture: ComponentFixture<BeaconNodeStatusComponent>;
  let service: BeaconNodeService = MockService(BeaconNodeService);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        SharedModule,
        BrowserAnimationsModule
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

  it('it should display sync progress bar if synchronizing', () => {
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

  it('it should only display sync progress bar if connected', () => {
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
        head_slot: 1024,
        head_epoch: 32,
        justified_epoch: 31,
        finalized_epoch: 30,
      } as ChainHead);
      fixture.detectChanges();
      const content: HTMLElement = fixture.nativeElement;
      expect(content.textContent).toContain('1024');
      expect(content.textContent).toContain('31');
      expect(content.textContent).toContain('30');
    });

    it('should display a warning if > 4 epochs since finality', () => {
      component.chainHead$ = of({
        head_slot: 1024,
        head_epoch: 32,
        justified_epoch: 31,
        finalized_epoch: 20,
      } as ChainHead);
      fixture.detectChanges();
      const content: HTMLElement = fixture.nativeElement;
      expect(content.textContent).toContain('Warning');
    });
  });

  describe('Latest clock slot data', () => {
    it('should display \'Awaiting Genesis\' if slot number is negative', () => {
      component.chainHead$ = of({
        head_slot: -1024,
        head_epoch: 32,
        justified_epoch: 31,
        finalized_epoch: 30,
      } as ChainHead);
      component.latestClockSlotPoll$ = of(-1024);
      fixture.detectChanges();
      const content: HTMLElement = fixture.nativeElement;
      expect(content.textContent).toContain('Awaiting Genesis');
    });

    it('should display string representation of slot number if positive', () => {
      component.chainHead$ = of({
        head_slot: 1024,
        head_epoch: 32,
        justified_epoch: 31,
        finalized_epoch: 30,
      } as ChainHead);
      component.latestClockSlotPoll$ = of(1024);
      fixture.detectChanges();
      const content: HTMLElement = fixture.nativeElement;
      expect(content.textContent).toContain('1024');
    });
  });
});
