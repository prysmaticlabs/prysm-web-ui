import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountVoluntaryExitComponent } from './account-voluntary-exit.component';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { WalletService } from '../../../core/services/wallet.service';
import { MockService } from 'ng-mocks';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { of } from 'rxjs';
import {
  Account,
  ListAccountsResponse,
} from '../../../../proto/validator/accounts/v2/web_api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AccountVoluntaryExitComponent', () => {
  let component: AccountVoluntaryExitComponent;
  let fixture: ComponentFixture<AccountVoluntaryExitComponent>;
  let activatedRouteStub: ActivatedRoute;
  let walletService: WalletService;

  beforeEach(waitForAsync(() => {
    walletService = MockService(WalletService);
    activatedRouteStub = MockService(ActivatedRoute);
    activatedRouteStub.snapshot = {
      url: [],
      params: {},
      queryParams: {
        publicKey: '',
      },
      fragment: '',
      data: {},
      outlet: '',
      component: '',
      routeConfig: {},
      root: new ActivatedRouteSnapshot(),
      parent: null,
      children: [],
      firstChild: null,
      pathFromRoot: [],
      paramMap: {
        get: () => '',
        getAll: () => [],
        has: (str: string) => false,
        keys: [],
      },
      queryParamMap: {
        get: () => '',
        getAll: () => [],
        has: (str: string) => false,
        keys: [],
      },
    };

    walletService.accounts = () => {
      const accounts = {
        accounts: [
          {
            validating_public_key: '12131231',
            account_name: 'merely-brief-gator',
          } as Account,
          {
            validating_public_key: '12131231',
            account_name: 'personally-conscious-echidna',
          } as Account,
          {
            validating_public_key: '12131231',
            account_name: 'slightly-amused-goldfish',
          } as Account,
          {
            validating_public_key: '12131231',
            account_name: 'nominally-present-bull',
          } as Account,
          {
            validating_public_key: '12131231',
            account_name: 'marginally-green-mare',
          } as Account,
        ],
      } as ListAccountsResponse;
      return of(accounts);
    };

    TestBed.configureTestingModule({
      declarations: [AccountVoluntaryExitComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: WalletService,
          useValue: walletService,
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteStub,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountVoluntaryExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
