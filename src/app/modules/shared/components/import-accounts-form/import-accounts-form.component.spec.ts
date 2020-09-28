import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxFileDropModule } from 'ngx-file-drop';

import { ImportAccountsFormComponent } from './import-accounts-form.component';

describe('ImportAccountsFormComponent', () => {
  let component: ImportAccountsFormComponent;
  let fixture: ComponentFixture<ImportAccountsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportAccountsFormComponent],
      imports: [
        NgxFileDropModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAccountsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
