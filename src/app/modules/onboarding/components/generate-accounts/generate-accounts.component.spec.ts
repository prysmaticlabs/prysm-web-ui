import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateAccountsComponent } from './generate-accounts.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('GenerateAccountsComponent', () => {
  let component: GenerateAccountsComponent;
  let fixture: ComponentFixture<GenerateAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateAccountsComponent ],
      imports: [ 
        SharedModule,
        ReactiveFormsModule,
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateAccountsComponent);
    component = fixture.componentInstance;
    const builder = new FormBuilder();
    component.formGroup = builder.group({
      numAccounts: new FormControl('', [
        Validators.required,
      ]),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
