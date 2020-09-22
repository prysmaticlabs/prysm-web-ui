import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconTriggerSelectComponent } from './icon-trigger-select.component';

describe('IconTriggerSelectComponent', () => {
  let component: IconTriggerSelectComponent;
  let fixture: ComponentFixture<IconTriggerSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconTriggerSelectComponent ]
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
