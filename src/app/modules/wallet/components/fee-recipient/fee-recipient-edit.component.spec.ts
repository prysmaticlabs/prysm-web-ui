import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditFeeRecipientComponent } from './fee-recipient-edit.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MockService } from 'ng-mocks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockPublicKeys } from '../../../core/mocks/index';
import { SharedModule } from '../../../shared/shared.module';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';

describe('EditFeeRecipientComponent', () => {
  let component: EditFeeRecipientComponent;
  let fixture: ComponentFixture<EditFeeRecipientComponent>;
  let validatorService: ValidatorService
  let snackBar: MatSnackBar;

  beforeEach(waitForAsync(() => {
    validatorService = MockService(ValidatorService);
    snackBar = MockService(MatSnackBar);
    const mockDialogDef = {
      close: () => {},
    };
    const pubKeys = mockPublicKeys;
    TestBed.configureTestingModule({
      declarations: [EditFeeRecipientComponent],
      imports: [
        SharedModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: pubKeys },
        { provide: MatDialogRef, useValue: mockDialogDef },
        { provide: ValidatorService, useValue: validatorService },
      ],
    }).compileComponents();
    validatorService = TestBed.inject(ValidatorService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFeeRecipientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
