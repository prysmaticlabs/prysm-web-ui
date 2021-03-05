import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { IconTriggerSelectComponent } from './icon-trigger-select.component';

describe('IconTriggerSelectComponent', () => {
  let component: IconTriggerSelectComponent;
  let fixture: ComponentFixture<IconTriggerSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IconTriggerSelectComponent],
      imports: [
        SharedModule,
        BrowserAnimationsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconTriggerSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
