import { HttpClientTestingModule } from '@angular/common/http/testing';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MockService } from 'ng-mocks';
import { Observable, of } from 'rxjs';
import { WalletService } from 'src/app/modules/core/services/wallet.service';

import { SharedModule } from 'src/app/modules/shared/shared.module';
import { CreateWalletRequest, CreateWalletResponse, WalletResponse } from 'src/app/proto/validator/accounts/v2/web_api';
import { NonhdWalletWizardComponent } from './nonhd-wallet-wizard.component';

describe('NonhdWalletWizardComponent', () => {
  let component: NonhdWalletWizardComponent;
  let fixture: ComponentFixture<NonhdWalletWizardComponent>;
  let walletService: WalletService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    walletService = MockService(WalletService);
    walletService.createWallet = (req: CreateWalletRequest): Observable<CreateWalletResponse> => {
      return of({
        wallet: { wallet_path: 'hello' } as WalletResponse,
      } as CreateWalletResponse);
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
        SharedModule.forRoot(),
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
    fixture = TestBed.createComponent(NonhdWalletWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
