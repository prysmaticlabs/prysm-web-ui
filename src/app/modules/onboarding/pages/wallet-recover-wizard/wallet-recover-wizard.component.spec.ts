import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl, FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { RecoverWalletRequest } from '../../../../proto/validator/accounts/v2/web_api';
import { WalletRecoverWizardComponent } from './wallet-recover-wizard.component';


describe('WalletRecoverWizardComponent', () => {
  let component: WalletRecoverWizardComponent;
  let fixture: ComponentFixture<WalletRecoverWizardComponent>;
  let walletService: WalletService;

  beforeEach(async(() => {
    walletService = MockService(WalletService);
    walletService.recover = (req: RecoverWalletRequest) => {
      return of({});
    };

    TestBed.configureTestingModule({
      declarations: [WalletRecoverWizardComponent],
      providers: [
        { provide: WalletService, useValue: walletService },
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();
    walletService = TestBed.inject(WalletService);
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
