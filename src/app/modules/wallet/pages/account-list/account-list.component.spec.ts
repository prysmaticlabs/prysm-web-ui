import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountListComponent } from './account-list.component';
import { SharedModule } from '../../../shared/shared.module';
import { WalletService } from '../../../core/services/wallet.service';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { ListAccountsResponse, Account } from 'src/app/proto/validator/accounts/v2/web_api';

describe('AccountListComponent', () => {
  let component: AccountListComponent;
  let fixture: ComponentFixture<AccountListComponent>;
  let service: WalletService = MockService(WalletService);
  service.accounts$ = of({
    accounts: [{
      validatingPublicKey: '',
      accountName: 'Fritz',
      depositTxData: '',
      derivationPath: 'somepath'
    }] as Account[],
  } as ListAccountsResponse);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
      ],
      declarations: [AccountListComponent],
      providers: [
        { provide: WalletService, useValue: service },
      ]
    })
      .compileComponents();
    service = TestBed.inject(WalletService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
