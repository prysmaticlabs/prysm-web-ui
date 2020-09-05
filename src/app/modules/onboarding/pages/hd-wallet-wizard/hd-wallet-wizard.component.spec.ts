import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';
import { MockComponent } from 'ng-mocks';

import { HdWalletWizardComponent } from './hd-wallet-wizard.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { GenerateMnemonicComponent } from '../../components/generate-mnemonic/generate-mnemonic.component';
import { ConfirmMnemonicComponent } from '../../components/confirm-mnemonic/confirm-mnemonic.component';
import { GenerateAccountsComponent } from '../../components/generate-accounts/generate-accounts.component';
import { ChooseWalletPasswordComponent } from '../../components/choose-wallet-password/choose-wallet-password.component';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { AuthenticationService } from 'src/app/modules/core/services/auth.service';
import { WalletResponse, AuthResponse } from 'src/app/proto/validator/accounts/v2/web_api';

describe('HdWalletWizardComponent', () => {
  let component: HdWalletWizardComponent;
  let fixture: ComponentFixture<HdWalletWizardComponent>;
  let walletService: jasmine.SpyObj<WalletService>;
  let authService: jasmine.SpyObj<AuthenticationService>;
  let router: Router;

  beforeEach(async(() => {
    const walletSpy = jasmine.createSpyObj('WalletService', ['createWallet']);
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['signup']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      declarations: [ 
        MockComponent(GenerateMnemonicComponent),
        MockComponent(ConfirmMnemonicComponent),
        MockComponent(GenerateAccountsComponent),
        MockComponent(ChooseWalletPasswordComponent),
        HdWalletWizardComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: WalletService, useValue: walletSpy },
        { provide: AuthenticationService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ]
    })
    .compileComponents();
    walletService = TestBed.get(WalletService);
    authService = TestBed.get(AuthenticationService);
    router = TestBed.get(Router);
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
      component.registerFormGroups();
      component.passwordFormGroup.controls.password.setValue('Passw0rdz2020$');
      component.passwordFormGroup.controls.passwordConfirmation.setValue('Passw0rdz2020$');
      component.accountsFormGroup.controls.numAccounts.setValue(5);
      component.mnemonicFormGroup.controls.mnemonic.setValue('hello fish');
      walletService.createWallet.and.returnValue(of({ walletPath: 'hello' } as WalletResponse));
      authService.signup.and.returnValue(of({ token: 'hello' } as AuthResponse));
      component.createWallet(new Event('submit'));
      fixture.detectChanges();
      expect(walletService.createWallet).toHaveBeenCalled();
      expect(authService.signup).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/gains-and-losses']);
    })
  });
});
