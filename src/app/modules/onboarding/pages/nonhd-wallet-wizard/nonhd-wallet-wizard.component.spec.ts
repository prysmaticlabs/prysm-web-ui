import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Observable, of } from 'rxjs';
import { MockService } from 'ng-mocks';

import { NonhdWalletWizardComponent } from './nonhd-wallet-wizard.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { AuthenticationService } from 'src/app/modules/auth/services/authentication.service';
import { WalletResponse, AuthResponse, CreateWalletRequest, CreateWalletResponse, AuthRequest } from 'src/app/proto/validator/accounts/v2/web_api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('NonhdWalletWizardComponent', () => {
  let component: NonhdWalletWizardComponent;
  let fixture: ComponentFixture<NonhdWalletWizardComponent>;
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
        NonhdWalletWizardComponent,
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
    fixture = TestBed.createComponent(NonhdWalletWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
