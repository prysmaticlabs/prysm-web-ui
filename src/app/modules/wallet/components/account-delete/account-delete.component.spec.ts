import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountDeleteComponent } from './account-delete.component';
import { WalletService } from '../../../core/services/wallet.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MockService } from 'ng-mocks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockPublicKeys } from '../../../core/mocks/index';
import { SharedModule } from '../../../shared/shared.module';

describe('AccountDeleteComponent', () => {
  let component: AccountDeleteComponent;
  let fixture: ComponentFixture<AccountDeleteComponent>;
  let walletService: WalletService;
  let snackBar: MatSnackBar;

  beforeEach(waitForAsync(() => {
    walletService = MockService(WalletService);
    snackBar = MockService(MatSnackBar);
    const mockDialogDef = {
      close: () => {},
    };
    const pubKeys = mockPublicKeys;
    TestBed.configureTestingModule({
      declarations: [AccountDeleteComponent],
      imports: [
        SharedModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: pubKeys },
        { provide: MatDialogRef, useValue: mockDialogDef },
        { provide: WalletService, useValue: walletService },
      ],
    }).compileComponents();
    walletService = TestBed.inject(WalletService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
