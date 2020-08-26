import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockKeysComponent } from './unlock-keys.component';

describe('UnlockKeysComponent', () => {
  let component: UnlockKeysComponent;
  let fixture: ComponentFixture<UnlockKeysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnlockKeysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlockKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
