import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmMnemonicComponent } from './confirm-mnemonic.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormBuilder, ReactiveFormsModule, FormsModule, FormControl, Validators } from '@angular/forms';
import { BlockCopyPasteDirective } from '../../directives/block-copy-paste.directive';
import { By } from '@angular/platform-browser';

describe('ConfirmMnemonicComponent', () => {
  let component: ConfirmMnemonicComponent;
  let fixture: ComponentFixture<ConfirmMnemonicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BlockCopyPasteDirective,
        ConfirmMnemonicComponent,
      ],
      imports: [
        SharedModule,
        ReactiveFormsModule,
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmMnemonicComponent);
    component = fixture.componentInstance;
    const builder = new FormBuilder();
    component.formGroup = builder.group({
      mnemonic: new FormControl('', [
        Validators.required,
        Validators.pattern(
          `[a-zA-Z ]*`, // Only words separated by spaces.
        )
      ]),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render input elements', () => {
    const compiled = fixture.debugElement.nativeElement;
    const input = compiled.querySelector('textarea[name="mnemonic"]');
    expect(input).toBeTruthy();
  });

  it('should check validity is falsy for empty form', () => {
    const form = component.formGroup;
    expect(form.valid).toBeFalsy();
  });

  it('should test form invalidity', () => {
    const form = component.formGroup;
    const input = fixture.nativeElement.querySelector('textarea[name="mnemonic"]');

    input.value = '1234';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(input.value).toContain('1234');
    expect(form.valid).toBeFalsy();

    const warnings = fixture.debugElement.query(By.css('.warnings'));
    expect(warnings).toBeTruthy();
  });

  it('should test form validity for properly formatted mnemonic', () => {
    const form = component.formGroup;
    const input = fixture.nativeElement.querySelector('textarea[name="mnemonic"]');
    input.value = 'tape hungry front clump chapter blush alien sauce spawn victory mother salt purpose drop mask hour foil physical daughter narrow sheriff agree master survey';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(form.valid).toBeTruthy();
  });

  it('should not show warnings on an empty form on pristine', () => {
    const warnings = fixture.debugElement.query(By.css('.warnings'));
    expect(warnings).toBeFalsy();
  });
});
