import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDropzoneComponent } from './import-dropzone.component';

describe('ImportDropzoneComponent', () => {
  let component: ImportDropzoneComponent;
  let fixture: ComponentFixture<ImportDropzoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportDropzoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
