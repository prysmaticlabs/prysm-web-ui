import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Observable, of } from 'rxjs';
import { MockComponent, MockService } from 'ng-mocks';

import { HdWalletWizardComponent } from './hd-wallet-wizard.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { GenerateMnemonicComponent } from '../../components/generate-mnemonic/generate-mnemonic.component';
import { ConfirmMnemonicComponent } from '../../components/confirm-mnemonic/confirm-mnemonic.component';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  WalletResponse,
  CreateWalletRequest,
  CreateWalletResponse,
} from 'src/app/proto/validator/accounts/v2/web_api';

describe('HdWalletWizardComponent', () => {
  let component: HdWalletWizardComponent;
  let fixture: ComponentFixture<HdWalletWizardComponent>;
  let walletService: WalletService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    walletService = MockService(WalletService);
    walletService.createWallet = (req: CreateWalletRequest): Observable<CreateWalletResponse> => {
      return of({
        wallet: { walletPath: 'hello' } as WalletResponse,
      } as CreateWalletResponse);
    };
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(GenerateMnemonicComponent),
        MockComponent(ConfirmMnemonicComponent),
        HdWalletWizardComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        SharedModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: WalletService, useValue: walletService },
        { provide: Router, useValue: routerSpy },
      ]
    })
    .compileComponents();
    walletService = TestBed.inject(WalletService);
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HdWalletWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Create wallet', () => {
    it('should get deposit data upon wallet creation and signup', () => {
      component.accountsFormGroup.controls.numAccounts.setValue(5);
      component.mnemonicFormGroup.controls.mnemonic.setValue('hello fish');
      component.createWallet(new Event('submit'));
      fixture.detectChanges();
      expect(component).toBeDefined();
    });
  });
});
