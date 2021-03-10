import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
import { AuthenticationService } from 'src/app/modules/core/services/authentication.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  WalletResponse,
  AuthResponse,
  CreateWalletRequest,
  CreateWalletResponse,
  AuthRequest,
} from 'src/app/proto/validator/accounts/v2/web_api';

describe('HdWalletWizardComponent', () => {
  let component: HdWalletWizardComponent;
  let fixture: ComponentFixture<HdWalletWizardComponent>;
  let walletService: WalletService;
  let authService: AuthenticationService;
  let router: Router;

  beforeEach(async(() => {
    walletService = MockService(WalletService);
    authService = MockService(AuthenticationService);
    walletService.createWallet = (req: CreateWalletRequest): Observable<CreateWalletResponse> => {
      return of({
        wallet: { walletPath: 'hello' } as WalletResponse,
      } as CreateWalletResponse);
    };
    authService.signup = (req: AuthRequest): Observable<AuthResponse> => {
      return of({ token: 'hello' } as AuthResponse);
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
        { provide: AuthenticationService, useValue: authService },
        { provide: Router, useValue: routerSpy },
      ]
    })
    .compileComponents();
    walletService = TestBed.inject(WalletService);
    authService = TestBed.inject(AuthenticationService);
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
      component.passwordFormGroup.controls.password.setValue('Passw0rdz2020$');
      component.passwordFormGroup.controls.passwordConfirmation.setValue('Passw0rdz2020$');
      component.accountsFormGroup.controls.numAccounts.setValue(5);
      component.mnemonicFormGroup.controls.mnemonic.setValue('hello fish');
      component.createWallet(new Event('submit'));
      fixture.detectChanges();
      expect(component).toBeDefined();
    });
  });
});
