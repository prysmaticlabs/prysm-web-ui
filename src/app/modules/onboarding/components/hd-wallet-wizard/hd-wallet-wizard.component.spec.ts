import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { HdWalletWizardComponent } from './hd-wallet-wizard.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { GenerateMnemonicComponent } from '../generate-mnemonic/generate-mnemonic.component';
import { ConfirmMnemonicComponent } from '../confirm-mnemonic/confirm-mnemonic.component';
import { GenerateAccountsComponent } from '../generate-accounts/generate-accounts.component';
import { ChooseWalletPasswordComponent } from '../choose-wallet-password/choose-wallet-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('HdWalletWizardComponent', () => {
  let component: HdWalletWizardComponent;
  let fixture: ComponentFixture<HdWalletWizardComponent>;

  beforeEach(async(() => {
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
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HdWalletWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
