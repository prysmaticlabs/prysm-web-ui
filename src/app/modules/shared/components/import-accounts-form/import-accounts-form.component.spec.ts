import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxFileDropModule } from 'ngx-file-drop';
import { EnvironmenterService } from 'src/app/modules/core/services/environmenter.service';

import { ImportAccountsFormComponent } from './import-accounts-form.component';

describe('ImportAccountsFormComponent', () => {
  let component: ImportAccountsFormComponent;
  let fixture: ComponentFixture<ImportAccountsFormComponent>;
  const serviceSpy = jasmine.createSpyObj('EnvironmenterService', ['env']);
  const fb:FormBuilder = new FormBuilder();
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ImportAccountsFormComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgxFileDropModule,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: EnvironmenterService, useValue: serviceSpy },
        { provide: FormBuilder, useValue: fb }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAccountsFormComponent);
    component = fixture.componentInstance;
    component.formGroup = fb.group({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
