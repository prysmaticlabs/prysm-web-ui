import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { FilesAndDirectoriesComponent } from './files-and-directories.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FilesAndDirectoriesComponent', () => {
  let component: FilesAndDirectoriesComponent;
  let fixture: ComponentFixture<FilesAndDirectoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesAndDirectoriesComponent ],
      imports: [
        SharedModule,
        BrowserAnimationsModule
      ]
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
