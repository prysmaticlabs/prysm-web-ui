import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { of } from 'rxjs';
import { MockService } from 'ng-mocks';

import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { DeleteSelectedAccountsComponent, CONFIRMATION_TEXT } from './delete-selected-accounts.component';
import { mockPublicKeys } from 'src/app/modules/core/mocks';
import { DeleteAccountsRequest, DeleteAccountsResponse } from 'src/app/proto/validator/accounts/v2/web_api';

describe('DeleteSelectedAccountsComponent', () => {
  let component: DeleteSelectedAccountsComponent;
  let fixture: ComponentFixture<DeleteSelectedAccountsComponent>;
  let service: WalletService = MockService(WalletService);
  const mockDialogDef = {
    close: () => {},
  };
  const pubKeys = mockPublicKeys;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DeleteSelectedAccountsComponent
      ],
      imports: [
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: pubKeys },
        { provide: MatDialogRef, useValue: mockDialogDef },
        { provide: WalletService, useValue: service },
      ]
    })
    .compileComponents();
    service = TestBed.inject(WalletService);
  }));

  beforeEach(() => {
    spyOn(service, 'deleteAccounts').and.returnValue(of({
      deletedKeys: ['a', 'b', 'c'],
    } as DeleteAccountsResponse));
    fixture = TestBed.createComponent(DeleteSelectedAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate the user typed in a confirmation text to proceed with deletion', () => {
    let input = {
      value: 'abcd',
    } as AbstractControl;
    let res = component.validateConfirmation(input);
    expect(res).toEqual({ wrongValue: true });

    input = {
      value: CONFIRMATION_TEXT,
    } as AbstractControl;
    res = component.validateConfirmation(input);
    expect(res).toEqual(null);
  });

  it('should not call the delete accounts function if form is invalid', () => {
    component.deleteAccounts();
    fixture.detectChanges();
    expect(service.deleteAccounts).not.toHaveBeenCalled();
  });

  it('should call the delete accounts function with the form value if valid', () => {
    component.confirmGroup.controls.confirmation.setValue(CONFIRMATION_TEXT);
    expect(component.confirmGroup.valid).toBeTrue();
    component.deleteAccounts();
    fixture.detectChanges();
    expect(service.deleteAccounts).toHaveBeenCalledWith({
      publicKeys: mockPublicKeys,
    } as DeleteAccountsRequest);
  });

  describe('ComponentUI', () => {
    it('should display a loading state', () => {
      let text = (fixture.nativeElement as HTMLElement).textContent;
      expect(text).toContain('Delete Selected Account(s)');
      component.loading = true;
      fixture.detectChanges();
      text = (fixture.nativeElement as HTMLElement).textContent;
      expect(text).toContain('Deleting Account(s)...');
    });

    it('should call the delete accounts function upon UI form submission', () => {
      const input = fixture.nativeElement.querySelector(`input[name='confirmation']`);
      input.value = CONFIRMATION_TEXT;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      const submitButton = fixture.nativeElement.querySelector(`button[name='submit']`);
      submitButton.click();
      fixture.detectChanges();
      expect(service.deleteAccounts).toHaveBeenCalledWith({
        publicKeys: mockPublicKeys,
      } as DeleteAccountsRequest);
    });
  });
});
