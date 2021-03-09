import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { LogsStreamComponent } from './logs-stream.component';

describe('LogsStreamComponent', () => {
  let component: LogsStreamComponent;
  let fixture: ComponentFixture<LogsStreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogsStreamComponent ],
      imports: [
        SharedModule,
      ]
    })
    .compileComponents();
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
