import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Overlay } from '@angular/cdk/overlay';

import { LoginComponent } from './login.component';
import { SharedModule } from '../../shared/shared.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
      ],
      providers: [
        Overlay,
        FormBuilder,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render input elements', () => {
    const compiled = fixture.debugElement.nativeElement;
    const passwordInput = compiled.querySelector('input[name="password"]');
    expect(passwordInput).toBeTruthy();
  });

  it('should check validity is falsy for empty form', () => {
    const form = component.loginForm;
    expect(form.valid).toBeFalsy();
  });

  it('should test form invalidity for password', () => {
    const form = component.loginForm;
    const passwordInput = fixture.nativeElement.querySelector('input[name="password"]');
    const submitButton = fixture.nativeElement.querySelector('button[name="submit"]');

    passwordInput.value = '1234';
    passwordInput.dispatchEvent(new Event('input'));
    submitButton.click();
    fixture.detectChanges();
    expect(passwordInput.value).toContain('1234');
    expect(form.valid).toBeFalsy();

    const invalidPasswordText = fixture.nativeElement.querySelector('div[name="passwordReq"]');
    expect(invalidPasswordText).toBeTruthy();
  });

  it('should not show warnings on an empty form on start', () => {
    const reqPasswordText = fixture.nativeElement.querySelector('div[name="passwordReq"]');
    expect(reqPasswordText).toBeFalsy();
  });

  it('should show required warnings after click', () => {
    const reqPasswordText = fixture.nativeElement.querySelector('div[name="passwordReq"]');
    const submitButton = fixture.nativeElement.querySelector('button[name="submit"]');
    submitButton.click();
    fixture.detectChanges();
    expect(reqPasswordText).toBeFalsy();
  });
});
