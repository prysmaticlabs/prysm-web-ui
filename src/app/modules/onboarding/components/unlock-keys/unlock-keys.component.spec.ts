import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockKeysComponent } from './unlock-keys.component';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';

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
});
