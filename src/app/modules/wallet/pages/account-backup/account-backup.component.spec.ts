import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBackupComponent } from './account-backup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WalletService } from '../../../core/services/wallet.service';
import { MockService } from 'ng-mocks';
import { BackupAccountsResponse } from 'src/app/proto/validator/accounts/v2/web_api';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SpecMockProvider } from '../../../shared/services/spec.mock.provider';
import { mockPublicKeys } from '../../../core/mocks/index';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from '../../../shared/shared.module';

describe('AccountBackupComponent', () => {
  let component: AccountBackupComponent;
  let fixture: ComponentFixture<AccountBackupComponent>;
  let walletService: WalletService;
  let activatedRoute: ActivatedRoute;
  let snackBar: MatSnackBar;

  beforeEach(async(() => {
    walletService = MockService(WalletService);
    walletService.backUpAccounts = ({}) => {
      return of({ zipFile: 'Hello' } as BackupAccountsResponse);
    };

    snackBar = MockService(MatSnackBar);

    activatedRoute = MockService(ActivatedRoute);
    activatedRoute.snapshot = SpecMockProvider.activatedRouteMock(
      [],
      {
        publicKeys: mockPublicKeys,
      },
      {}
    );

    TestBed.configureTestingModule({
      declarations: [AccountBackupComponent],
      imports: [
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
        { provide: WalletService, useValue: walletService },
        {
          provide: MatSnackBar,
          useValue: snackBar,
        },
      ],
    }).compileComponents();
    walletService = TestBed.inject(WalletService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountBackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have value', () => {
    expect(component.encryptionPasswordForm).toBeTruthy();
  });

  it('public keys should not be empty', () => {
    expect(component.publicKeys.length).toBeGreaterThan(0);
  });
});
