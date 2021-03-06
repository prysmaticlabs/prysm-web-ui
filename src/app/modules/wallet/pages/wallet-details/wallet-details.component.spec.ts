import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent, MockService } from 'ng-mocks';
import { of } from 'rxjs';

import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { WalletResponse } from 'src/app/proto/validator/accounts/v2/web_api';
import { FilesAndDirectoriesComponent } from '../../components/files-and-directories/files-and-directories.component';
import { WalletHelpComponent } from '../../components/wallet-help/wallet-help.component';
import { WalletKindComponent } from '../../components/wallet-kind/wallet-kind.component';
import { WalletDetailsComponent } from './wallet-details.component';

describe('WalletDetailsComponent', () => {
  let component: WalletDetailsComponent;
  const service: WalletService = MockService(WalletService);
  let fixture: ComponentFixture<WalletDetailsComponent>;
  service.walletConfig$ = of({} as WalletResponse);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WalletDetailsComponent,
        MockComponent(WalletKindComponent),
        MockComponent(WalletHelpComponent),
        MockComponent(FilesAndDirectoriesComponent),
      ],
      imports: [SharedModule, BrowserAnimationsModule],
      providers: [{ provide: WalletService, useValue: service }],
    }).compileComponents();
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
