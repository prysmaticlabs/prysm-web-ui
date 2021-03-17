import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBackupComponent } from './account-backup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WalletService } from '../../../core/services/wallet.service';
import { MockService } from 'ng-mocks';
import { BackupAccountsResponse } from 'src/app/proto/validator/accounts/v2/web_api';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from '../../../shared/shared.module';
import { NotificationService } from '../../../shared/services/notification.service';

describe('AccountBackupComponent', () => {
  let component: AccountBackupComponent;
  let fixture: ComponentFixture<AccountBackupComponent>;
  let walletService: WalletService;
  let notification: NotificationService;

  beforeEach(async(() => {
    walletService = MockService(WalletService);
    walletService.backUpAccounts = ({}) => {
      return of({ zipFile: 'Hello' } as BackupAccountsResponse);
    };
    notification = MockService(NotificationService);

    TestBed.configureTestingModule({
      declarations: [AccountBackupComponent],
      imports: [
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: WalletService, useValue: walletService },
        {
          provide: NotificationService,
          useValue: notification,
        },
      ],
    }).compileComponents();
    walletService = TestBed.inject(WalletService);
    notification = TestBed.inject(NotificationService);
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
});
