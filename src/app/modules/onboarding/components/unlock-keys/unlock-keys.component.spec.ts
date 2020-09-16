import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockKeysComponent } from './unlock-keys.component';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { By } from '@angular/platform-browser';

describe('UnlockKeysComponent', () => {
  let component: UnlockKeysComponent;
  let fixture: ComponentFixture<UnlockKeysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnlockKeysComponent ],
      imports: [
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlockKeysComponent);
    component = fixture.componentInstance;
    const builder = new FormBuilder();
    component.formGroup = builder.group({
      keystoresPassword: new FormControl('', [
        Validators.required,
      ]),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render input elements', () => {
    const compiled = fixture.debugElement.nativeElement;
    const input = compiled.querySelector(`input[name='keystoresPassword']`);
    expect(input).toBeTruthy();
  });

  it('should check validity is falsy for empty form', () => {
    const form = component.formGroup;
    expect(form?.valid).toBeFalsy();
  });

  it('should test form invalidity', () => {
    const form = component.formGroup;
    const input = fixture.nativeElement.querySelector(`input[name='keystoresPassword']`);

    input.value = '';
    input.dispatchEvent(new Event('input'));
    component.formGroup?.markAllAsTouched();
    fixture.detectChanges();
    expect(input.value).toBeFalsy();
    expect(form?.valid).toBeFalsy();
    expect(form?.controls.keystoresPassword.errors).toBeTruthy();

    const warnings = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(warnings).toBeTruthy();
  });

  it('should test form validity', () => {
    const form = component.formGroup;
    const input = fixture.nativeElement.querySelector(`input[name='keystoresPassword']`);

    input.value = '10';
    input.dispatchEvent(new Event('input'));
    component.formGroup?.markAllAsTouched();
    fixture.detectChanges();
    expect(input.value).toContain('10');
    expect(form?.valid).toBeTruthy();

    const warnings = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(warnings).toEqual([]);
  });

  it('should not show warnings on an empty form on pristine', () => {
    const warnings = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(warnings).toEqual([]);
  });
});
