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
import { GenerateAccountsComponent } from '../../components/generate-accounts/generate-accounts.component';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { AuthenticationService } from 'src/app/modules/core/services/auth.service';
import { WalletResponse, AuthResponse, CreateWalletRequest } from 'src/app/proto/validator/accounts/v2/web_api';

describe('HdWalletWizardComponent', () => {
  let component: HdWalletWizardComponent;
  let fixture: ComponentFixture<HdWalletWizardComponent>;
  let walletService: WalletService;
  let authService: AuthenticationService;
  let router: Router;

  beforeEach(async(() => {
    walletService = MockService(WalletService);
    authService = MockService(AuthenticationService);
    walletService.createWallet = (req: CreateWalletRequest): Observable<WalletResponse> => {
      return of({ walletPath: 'hello' } as WalletResponse);
    };
    authService.signup = (password: string): Observable<AuthResponse> => {
      return of({ token: 'hello' } as AuthResponse);
    };
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(GenerateMnemonicComponent),
        MockComponent(ConfirmMnemonicComponent),
        MockComponent(GenerateAccountsComponent),
        HdWalletWizardComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
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
    it('should redirect to dashboard upon wallet creation and signup', () => {
      component.passwordFormGroup.controls.password.setValue('Passw0rdz2020$');
      component.passwordFormGroup.controls.passwordConfirmation.setValue('Passw0rdz2020$');
      component.accountsFormGroup.controls.numAccounts.setValue(5);
      component.mnemonicFormGroup.controls.mnemonic.setValue('hello fish');
      component.createWallet(new Event('submit'));
      fixture.detectChanges();
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/gains-and-losses']);
    });
  });
});
