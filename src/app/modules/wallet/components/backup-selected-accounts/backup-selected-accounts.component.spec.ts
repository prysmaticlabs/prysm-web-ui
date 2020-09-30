import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { of } from 'rxjs';
import { MockService } from 'ng-mocks';

import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { BackupSelectedAccountsComponent } from './backup-selected-accounts.component';
import { mockPublicKeys } from 'src/app/modules/core/mocks';
import { BackupAccountsRequest, BackupAccountsResponse } from 'src/app/proto/validator/accounts/v2/web_api';

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
    spyOn(service, 'backupAccounts').and.returnValue(of({
      zipFile: 'asdkaskdkasd',
    } as BackupAccountsResponse));
    fixture = TestBed.createComponent(BackupSelectedAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call the backup accounts function if form is invalid', () => {
    component.backup();
    fixture.detectChanges();
    expect(service.backupAccounts).not.toHaveBeenCalled();
  });

  it('should call the backup accounts function with the form value if valid', () => {
    const strongPassword = 'Passw0rdz$2020';
    component.passwordGroup.controls.password.setValue(strongPassword);
    expect(component.passwordGroup.valid).toBeTrue();
    component.backup();
    fixture.detectChanges();
    expect(service.backupAccounts).toHaveBeenCalledWith({
      publicKeys: mockPublicKeys,
      keystoresPassword: strongPassword,
    } as BackupAccountsRequest);
  });

  describe('ComponentUI', () => {
    it('should display a loading state', () => {
      let text = (fixture.nativeElement as HTMLElement).textContent;
      expect(text).toContain('Backup Selected Account(s)');
      component.loading = true;
      fixture.detectChanges();
      text = (fixture.nativeElement as HTMLElement).textContent;
      expect(text).toContain('Generating Backup File');
    });

    it('should display different text if zip file exists and not loading', () => {
      component.backupFile = 'hello';
      fixture.detectChanges();
      const text = (fixture.nativeElement as HTMLElement).textContent;
      expect(text).toContain('Your Backup File is Ready');
    });

    it('should call the backup accounts function upon UI form submission', () => {
      const input = fixture.nativeElement.querySelector(`input[name='password']`);
      const strongPassword = 'Passw0rdz$2020';
      input.value = strongPassword;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      const submitButton = fixture.nativeElement.querySelector(`button[name='submit']`);
      submitButton.click();
      fixture.detectChanges();
      expect(service.backupAccounts).toHaveBeenCalledWith({
        publicKeys: mockPublicKeys,
        keystoresPassword: strongPassword,
      } as BackupAccountsRequest);
    });
  });
});
