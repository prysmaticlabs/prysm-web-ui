import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';
import { MockComponent } from 'ng-mocks';

import { NonhdWalletWizardComponent } from './nonhd-wallet-wizard.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { GenerateAccountsComponent } from '../../components/generate-accounts/generate-accounts.component';
import { ChooseWalletPasswordComponent } from '../../components/choose-wallet-password/choose-wallet-password.component';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { AuthenticationService } from 'src/app/modules/core/services/auth.service';
import { ImportAccountsComponent } from '../../components/import-accounts/import-accounts.component';
import { WalletResponse, AuthResponse } from 'src/app/proto/validator/accounts/v2/web_api';

describe('NonhdWalletWizardComponent', () => {
  let component: NonhdWalletWizardComponent;
  let fixture: ComponentFixture<NonhdWalletWizardComponent>;
  let walletService: WalletService;
  let authService: AuthenticationService;
  let router: Router;

  beforeEach(async(() => {
    const walletSpy = jasmine.createSpyObj('WalletService', ['createWallet']);
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['signup']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(ImportAccountsComponent),
        MockComponent(GenerateAccountsComponent),
        MockComponent(ChooseWalletPasswordComponent),
        NonhdWalletWizardComponent,
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
    walletService = TestBed.inject(WalletService);
    authService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonhdWalletWizardComponent);
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
      component.unlockFormGroup.controls.keystoresPassword.setValue('KeystorePass');
      component.importFormGroup.controls.keystoresImported.setValue([] as Uint8Array[]);
      walletService.createWallet.and.returnValue(of({ walletPath: 'hello' } as WalletResponse));
      authService.signup.and.returnValue(of({ token: 'hello' } as AuthResponse));
      component.createWallet(new Event('submit'));
      fixture.detectChanges();
      expect(walletService.createWallet).toHaveBeenCalled();
      expect(authService.signup).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/gains-and-losses']);
    });
  });
});
