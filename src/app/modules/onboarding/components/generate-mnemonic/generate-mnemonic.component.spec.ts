import { ComponentFixture, TestBed, inject, fakeAsync, waitForAsync } from '@angular/core/testing';

import { GenerateMnemonicComponent } from './generate-mnemonic.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('GenerateMnemonicComponent', () => {
  let walletService: WalletService;
  const spy = jasmine.createSpyObj('WalletService', ['generateMnemonic$']);

  let component: GenerateMnemonicComponent;
  let fixture: ComponentFixture<GenerateMnemonicComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateMnemonicComponent ],
      imports: [
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: WalletService, useValue: spy },
      ]
    })
    .compileComponents();
    walletService = TestBed.inject(WalletService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateMnemonicComponent);
    component = fixture.componentInstance;
    walletService.generateMnemonic$ = of('hello');
    component.mnemonic$ = walletService.generateMnemonic$;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display generated mnemonic from service', fakeAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const text: HTMLElement = fixture.nativeElement;
      expect(text.textContent).toContain('hello');
    });
  }));
});
