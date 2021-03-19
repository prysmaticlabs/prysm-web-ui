import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from 'ng-mocks';
import { WalletService } from 'src/app/modules/core/services/wallet.service';

import { SlashingProtectionComponent } from './slashing-protection.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('SlashingProtectionComponent', () => {
  let component: SlashingProtectionComponent;
  let fixture: ComponentFixture<SlashingProtectionComponent>;
  let walletService: WalletService;
  beforeEach(async(() => {
    walletService = MockService(WalletService);
    TestBed.configureTestingModule({
      declarations: [SlashingProtectionComponent],
      providers: [{ provide: WalletService, useValue: walletService }],
      imports: [RouterTestingModule],
    }).compileComponents();
    walletService = TestBed.inject(WalletService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlashingProtectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
