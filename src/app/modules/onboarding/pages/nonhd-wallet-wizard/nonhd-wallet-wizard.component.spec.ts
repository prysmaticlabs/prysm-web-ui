import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MockComponent } from 'ng-mocks';

import { SharedModule } from 'src/app/modules/shared/shared.module';
import { NonhdWalletWizardComponent } from './nonhd-wallet-wizard.component';
import { ImportAccountsComponent } from '../../components/import-accounts/import-accounts.component';
import { UnlockKeysComponent } from '../../components/unlock-keys/unlock-keys.component';
import { ChooseWalletPasswordComponent } from '../../components/choose-wallet-password/choose-wallet-password.component';

describe('NonhdWalletWizardComponent', () => {
  let component: NonhdWalletWizardComponent;
  let fixture: ComponentFixture<NonhdWalletWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NonhdWalletWizardComponent,
        MockComponent(ImportAccountsComponent),
        MockComponent(UnlockKeysComponent),
        MockComponent(ChooseWalletPasswordComponent),
      ],
      imports: [
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
      ]
    })
    .compileComponents();
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
