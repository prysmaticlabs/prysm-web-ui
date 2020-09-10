import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivationQueueComponent } from './activation-queue.component';

describe('ActivationQueueComponent', () => {
  let component: ActivationQueueComponent;
  let fixture: ComponentFixture<ActivationQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivationQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivationQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
