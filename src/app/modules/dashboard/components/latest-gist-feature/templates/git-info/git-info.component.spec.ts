import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GitInfoComponent } from './git-info.component';

describe('GitInfoComponent', () => {
  let component: GitInfoComponent;
  let fixture: ComponentFixture<GitInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GitInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GitInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
