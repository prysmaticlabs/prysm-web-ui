import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmMnemonicComponent } from './confirm-mnemonic.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormBuilder, ReactiveFormsModule, FormsModule, FormControl, Validators } from '@angular/forms';
import { BlockCopyPasteDirective } from '../../directives/block-copy-paste.directive';

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
});
