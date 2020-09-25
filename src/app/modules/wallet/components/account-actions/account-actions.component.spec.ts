import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { KeymanagerKind, WalletResponse } from 'src/app/proto/validator/accounts/v2/web_api';

import { AccountActionsComponent } from './account-actions.component';

describe('AccountActionsComponent', () => {
  let component: AccountActionsComponent;
  let fixture: ComponentFixture<AccountActionsComponent>;
  let service: WalletService = MockService(WalletService);
  service.walletConfig$ = of({
    keymanagerKind: KeymanagerKind.DERIVED,
  } as WalletResponse);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountActionsComponent],
      imports: [
        SharedModule,
      ],
      providers: [
        { provide: WalletService, useValue: service }
      ]
    })
    .compileComponents();
    service = TestBed.inject(WalletService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not show the import button if keymanager kind is DERIVED', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).not.toContain('Import');
    expect(text).toContain('New Account');
  });
});
