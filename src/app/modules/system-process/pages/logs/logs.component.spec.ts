import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsComponent } from './logs.component';
import { SharedModule } from '../../../shared/shared.module';
import { LogsService } from '../../../core/services/logs.service';
import { MockComponent, MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { LogsStreamComponent } from '../../components/logs-stream/logs-stream.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LogsComponent', () => {
  let component: LogsComponent;
  let fixture: ComponentFixture<LogsComponent>;
  let service: LogsService = MockService(LogsService);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        LogsComponent,
        MockComponent(LogsStreamComponent),
      ],
      providers: [
        { provide: LogsService, useValue: service },
      ]
    })
    .compileComponents();
    service = TestBed.inject(LogsService);
  }));

  beforeEach(() => {
    service.beaconLogs = () => of('');
    service.validatorLogs = () => of('');
    fixture = TestBed.createComponent(LogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
