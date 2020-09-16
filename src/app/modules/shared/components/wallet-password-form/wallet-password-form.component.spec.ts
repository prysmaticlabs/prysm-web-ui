import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletPasswordFormComponent } from './wallet-password-form.component';
import { FormBuilder, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('WalletPasswordFormComponent', () => {
  let component: WalletPasswordFormComponent;
  let fixture: ComponentFixture<WalletPasswordFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletPasswordFormComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletPasswordFormComponent);
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
    const passwordInput = compiled.querySelector(`input[name='password']`);
    const confirmationInput = compiled.querySelector(`input[name='passwordConfirmation']`);
    expect(passwordInput).toBeTruthy();
    expect(confirmationInput).toBeTruthy();
  });

  it('should check validity is falsy for empty form', () => {
    const form = component.formGroup;
    expect(form?.valid).toBeFalsy();
  });

  it('should test form invalidity for password too short', () => {
    const form = component.formGroup;
    const passwordInput = fixture.nativeElement.querySelector(`input[name='password']`);

    // Length requirement.
    passwordInput.value = '1234';
    passwordInput.dispatchEvent(new Event('input'));
    component.formGroup?.markAllAsTouched();
    fixture.detectChanges();

    expect(form?.valid).toBeFalsy();

    const warnings = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(warnings).toBeTruthy();
  });

  it('should test form invalidity for password not containing a number nor special character', () => {
    const form = component.formGroup;
    const passwordInput = fixture.nativeElement.querySelector(`input[name='password']`);

    // No number nor special character
    passwordInput.value = 'Passworddddddd';
    passwordInput.dispatchEvent(new Event('input'));
    component.formGroup?.markAllAsTouched();
    fixture.detectChanges();

    expect(form?.valid).toBeFalsy();

    const warnings = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(warnings).toBeTruthy();
  });

  it('should test form validity for password meeting all requirements', () => {
    const form = component.formGroup;
    const passwordInput = fixture.nativeElement.querySelector(`input[name='password']`);
    const passwordConfirmation = fixture.nativeElement.querySelector(`input[name='passwordConfirmation']`);

    passwordInput.value = 'Password2$';
    passwordConfirmation.value = 'Password2$';
    passwordInput.dispatchEvent(new Event('input'));
    passwordConfirmation.dispatchEvent(new Event('input'));
    component.formGroup?.markAllAsTouched();
    fixture.detectChanges();

    expect(form?.valid).toBeTruthy();

    const warnings = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(warnings).toEqual([]);
  });

  it('should test form invalidity for password mismatch', () => {
    const form = component.formGroup;
    const passwordInput = fixture.nativeElement.querySelector(`input[name='password']`);
    const passwordConfirmation = fixture.nativeElement.querySelector(`input[name='passwordConfirmation']`);

    passwordInput.value = 'Passw0rddddd!';
    passwordConfirmation.value = 'Passw0rdddd!!';
    passwordInput.dispatchEvent(new Event('input'));
    component.formGroup?.markAllAsTouched();
    fixture.detectChanges();

    expect(form?.valid).toBeFalsy();

    const warnings = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(warnings).toBeTruthy();
  });

  it('should not show warnings on an empty form on pristine', () => {
    const warnings = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(warnings).toEqual([]);
  });
});
