import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccountsFormSelectionComponent } from './accounts-form-selection.component';
import { WalletService } from '../../../core/services/wallet.service';
import { MockService } from 'ng-mocks';
import { SharedModule } from '../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ListAccountsResponse } from '../../../../proto/validator/accounts/v2/web_api';

describe('AccountsFormSelectionComponent', () => {
  let component: AccountsFormSelectionComponent;
  let fixture: ComponentFixture<AccountsFormSelectionComponent>;
  let walletService: WalletService;

  beforeEach(waitForAsync(() => {
    walletService = MockService(WalletService);
    walletService.accounts = () => {
      return of(({
        accounts: [] as Account[],
      } as unknown) as ListAccountsResponse);
    };
    TestBed.configureTestingModule({
      declarations: [AccountsFormSelectionComponent],
      providers: [
        {
          provide: WalletService,
          useValue: walletService,
        },
      ],
      imports: [
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();
    walletService = TestBed.inject(WalletService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsFormSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
