import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportDropzoneComponent } from './import-dropzone.component';

describe('ImportDropzoneComponent', () => {
  let component: ImportDropzoneComponent;
  let fixture: ComponentFixture<ImportDropzoneComponent>;

  beforeEach(waitForAsync(() => {
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
