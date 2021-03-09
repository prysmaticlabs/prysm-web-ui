import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormBuilder,
  AbstractControlOptions,
} from '@angular/forms';
import { MockService } from 'ng-mocks';
import { AuthenticationService } from 'src/app/modules/core/services/authentication.service';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { WalletRecoverWizardComponent } from './wallet-recover-wizard.component';
import {
  RecoverWalletRequest,
  AuthRequest,
  AuthResponse,
} from '../../../../proto/validator/accounts/v2/web_api';
import { of } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';

describe('WalletRecoverWizardComponent', () => {
  let component: WalletRecoverWizardComponent;
  let fixture: ComponentFixture<WalletRecoverWizardComponent>;
  let walletService: WalletService;
  let authService: AuthenticationService;

  beforeEach(async(() => {
    walletService = MockService(WalletService);
    authService = MockService(AuthenticationService);
    walletService.recover = (req: RecoverWalletRequest) => {
      return of({});
    };
    authService.signup = (req: AuthRequest) => {
      return of({
        token: 'NewToken',
      } as AuthResponse);
    };

    TestBed.configureTestingModule({
      declarations: [WalletRecoverWizardComponent],
      providers: [
        { provide: AuthenticationService, useValue: authService },
        { provide: WalletService, useValue: walletService },
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();
    walletService = TestBed.inject(WalletService);
    authService = TestBed.inject(AuthenticationService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletRecoverWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass value to new form group', () => {
    const st = {
      next: () => {},
    } as MatStepper;
    let oldFg = new FormGroup({});
    const newFg = new FormGroup({
      firstKey: new FormControl(''),
    });
    oldFg = component.onNext(st, oldFg, newFg) as FormGroup;
    expect(oldFg.value).toEqual(newFg.value);
  });
});
