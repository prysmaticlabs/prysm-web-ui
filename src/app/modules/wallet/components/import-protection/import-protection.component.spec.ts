import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportProtectionComponent } from './import-protection.component';
import { WalletService } from '../../../core/services/wallet.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { MockService } from 'ng-mocks';
import { SharedModule } from '../../../shared/shared.module';

describe('ImportProtectionComponent', () => {
  let component: ImportProtectionComponent;
  let fixture: ComponentFixture<ImportProtectionComponent>;
  let walletService: WalletService;
  let notificationService: NotificationService;

  beforeEach(waitForAsync(() => {
    walletService = MockService(WalletService);
    notificationService = MockService(NotificationService);
    TestBed.configureTestingModule({
      declarations: [ImportProtectionComponent],
      imports: [SharedModule],
      providers: [
        { provide: WalletService, useValue: walletService },
        { provide: NotificationService, notificationService },
      ],
    }).compileComponents();
    walletService = TestBed.inject(WalletService);
    notificationService = TestBed.inject(NotificationService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportProtectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
