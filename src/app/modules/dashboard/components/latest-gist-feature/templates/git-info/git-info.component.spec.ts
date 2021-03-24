import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GitInfoComponent } from './git-info.component';

describe('GitInfoComponent', () => {
  let component: GitInfoComponent;
  let fixture: ComponentFixture<GitInfoComponent>;

  beforeEach(async(() => {
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
