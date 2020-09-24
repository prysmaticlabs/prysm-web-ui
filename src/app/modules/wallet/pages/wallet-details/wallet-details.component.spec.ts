import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { WalletResponse } from 'src/app/proto/validator/accounts/v2/web_api';

import { WalletDetailsComponent } from './wallet-details.component';

describe('WalletDetailsComponent', () => {
  let component: WalletDetailsComponent;
  const service: WalletService = MockService(WalletService);
  let fixture: ComponentFixture<WalletDetailsComponent>;
  service.walletConfig$ = of({} as WalletResponse);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletDetailsComponent ],
      providers: [
        { provide: WalletService, useValue: service },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
