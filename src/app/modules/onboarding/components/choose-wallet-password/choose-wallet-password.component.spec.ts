import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseWalletPasswordComponent } from './choose-wallet-password.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormBuilder, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Input } from '@angular/core';

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

  it('should check validity is falsy for empty form', () => {
    const form = component.formGroup;
    expect(form.valid).toBeFalsy();
  });

  it('should test form invalidity for password', () => {
    const form = component.formGroup;
    const passwordInput = fixture.nativeElement.querySelector('input[name="password"]');

    passwordInput.value = '1234';
    passwordInput.dispatchEvent(new Event('input'));
    component.formGroup.markAllAsTouched();
    fixture.detectChanges();

    expect(passwordInput.value).toContain('1234');
    expect(form.valid).toBeFalsy();

    const warnings = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(warnings).toBeTruthy();

  });

  it('should test form invalidity for password mismatch', () => {
    const form = component.formGroup;
    const passwordInput = fixture.nativeElement.querySelector('input[name="password"]');
    const passwordConfirmation = fixture.nativeElement.querySelector('input[name="passwordConfirmation"]');

    passwordInput.value = 'Passw0rddddd!';
    passwordConfirmation.value = 'Passw0rdddd!!';
    passwordInput.dispatchEvent(new Event('input'));
    component.formGroup.markAllAsTouched();
    fixture.detectChanges();

    expect(form.valid).toBeFalsy();

    const warnings = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(warnings).toBeTruthy();
  });

  it('should not show warnings on an empty form on pristine', () => {
    const warnings = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(warnings).toEqual([]);
  });
});
