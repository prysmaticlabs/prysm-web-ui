import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseWalletPasswordComponent } from './choose-wallet-password.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormBuilder, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('ChooseWalletPasswordComponent', () => {
  let component: ChooseWalletPasswordComponent;
  let fixture: ComponentFixture<ChooseWalletPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseWalletPasswordComponent ],
      imports: [ 
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseWalletPasswordComponent);
    component = fixture.componentInstance;
    const builder = new FormBuilder();
    component.formGroup = builder.group({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      passwordConfirmation: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render input elements', () => {
    const compiled = fixture.debugElement.nativeElement;
    const passwordInput = compiled.querySelector('input[name="password"]');
    const confirmationInput = compiled.querySelector('input[name="passwordConfirmation"]');
    expect(passwordInput).toBeTruthy();
    expect(confirmationInput).toBeTruthy();
  });

  // it('should check validity is falsy for empty form', () => {
  //   const form = component.loginForm;
  //   expect(form.valid).toBeFalsy();
  // });

  // it('should test form invalidity for password', () => {
  //   const form = component.loginForm;
  //   const passwordInput = fixture.nativeElement.querySelector('input[name="password"]');
  //   const submitButton = fixture.nativeElement.querySelector('button[name="submit"]');

  //   passwordInput.value = '1234';
  //   passwordInput.dispatchEvent(new Event('input'));
  //   submitButton.click();
  //   fixture.detectChanges();
  //   expect(passwordInput.value).toContain('1234');
  //   expect(form.valid).toBeFalsy();

  //   const invalidPasswordText = fixture.nativeElement.querySelector('div[name="passwordReq"]');
  //   expect(invalidPasswordText).toBeTruthy();
  // });

  // it('should not show warnings on an empty form on start', () => {
  //   const reqPasswordText = fixture.nativeElement.querySelector('div[name="passwordReq"]');
  //   expect(reqPasswordText).toBeFalsy();
  // });

  // it('should show required warnings after click', () => {
  //   const reqPasswordText = fixture.nativeElement.querySelector('div[name="passwordReq"]');
  //   const submitButton = fixture.nativeElement.querySelector('button[name="submit"]');
  //   submitButton.click();
  //   fixture.detectChanges();
  //   expect(reqPasswordText).toBeFalsy();
  // });
});
