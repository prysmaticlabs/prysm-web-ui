import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { LogsStreamComponent } from './logs-stream.component';

describe('LogsStreamComponent', () => {
  let component: LogsStreamComponent;
  let fixture: ComponentFixture<LogsStreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LogsStreamComponent],
      imports: [BrowserAnimationsModule, SharedModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogsStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
