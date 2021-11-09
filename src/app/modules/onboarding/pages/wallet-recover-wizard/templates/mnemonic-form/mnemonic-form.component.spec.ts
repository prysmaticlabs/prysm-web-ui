import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { MnemonicFormComponent } from './mnemonic-form.component';

describe('MnemonicFormComponent', () => {
  let component: MnemonicFormComponent;
  let fixture: ComponentFixture<MnemonicFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MnemonicFormComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MnemonicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should error if less mnemonic less than 1 account', () => {
    component.numAccountsFg.controls.numAccounts.setValue(-1);
    const errors = component.numAccountsFg.controls.numAccounts.errors || {};
    expect(errors['min']).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
