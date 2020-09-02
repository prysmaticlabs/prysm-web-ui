import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MockComponent } from 'ng-mocks';
import { NgxFileDropComponent } from 'ngx-file-drop';

import { ImportAccountsComponent } from './import-accounts.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';

describe('ImportAccountsComponent', () => {
  let component: ImportAccountsComponent;
  let fixture: ComponentFixture<ImportAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ImportAccountsComponent,
        MockComponent(NgxFileDropComponent),
      ],
      imports: [
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAccountsComponent);
    component = fixture.componentInstance;
    const builder = new FormBuilder();
    component.formGroup = builder.group({
      keystoresPassword: new FormControl([] as Uint8Array[], [
        Validators.required,
      ]),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
