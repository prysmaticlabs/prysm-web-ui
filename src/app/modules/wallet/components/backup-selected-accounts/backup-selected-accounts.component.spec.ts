import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MockService } from 'ng-mocks';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { BackupSelectedAccountsComponent } from './backup-selected-accounts.component';
import { mockPublicKeys } from 'src/app/modules/core/mocks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('BackupSelectedAccountsComponent', () => {
  let component: BackupSelectedAccountsComponent;
  let fixture: ComponentFixture<BackupSelectedAccountsComponent>;
  let service: WalletService = MockService(WalletService);
  const pubKeys = mockPublicKeys;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BackupSelectedAccountsComponent
      ],
      imports: [
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: pubKeys },
        { provide: MatDialogRef, useValue: {} },
        { provide: WalletService, useValue: service },
      ]
    })
    .compileComponents();
    service = TestBed.inject(WalletService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackupSelectedAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
