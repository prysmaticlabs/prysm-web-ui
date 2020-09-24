import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesAndDirectoriesComponent } from './files-and-directories.component';

describe('FilesAndDirectoriesComponent', () => {
  let component: FilesAndDirectoriesComponent;
  let fixture: ComponentFixture<FilesAndDirectoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesAndDirectoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesAndDirectoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
