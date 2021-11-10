import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MockComponent, MockService } from 'ng-mocks';
import { of } from 'rxjs';

import { ListAccountsResponse, Account } from 'src/app/proto/validator/accounts/v2/web_api';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { SharedModule } from '../../../shared/shared.module';
import { WalletService } from '../../../core/services/wallet.service';
import { AccountSelectionsComponent } from '../../components/account-selections/account-selections.component';
import { AccountActionsComponent } from '../../components/account-actions/account-actions.component';
import { AccountsTableComponent } from '../../components/accounts-table/accounts-table.component';
import { AccountsComponent } from './accounts.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AccountsComponent', () => {
  let component: AccountsComponent;
  let fixture: ComponentFixture<AccountsComponent>;
  let service: WalletService = MockService(WalletService);
  const valService: ValidatorService = MockService(ValidatorService);
  service.accounts = () => {
      return of({
      accounts: [{
        validatingPublicKey: '',
        accountName: 'Fritz',
        depositTxData: '',
        derivationPath: 'somepath'
      }] as Account[],
    } as ListAccountsResponse);
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        BrowserAnimationsModule
      ],
      declarations: [
        AccountsComponent,
        MockComponent(AccountSelectionsComponent),
        MockComponent(AccountActionsComponent),
        MockComponent(AccountsTableComponent),
      ],
      providers: [
        { provide: WalletService, useValue: service },
        { provide: ValidatorService, useValue: valService },
      ]
    })
      .compileComponents();
    service = TestBed.inject(WalletService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
