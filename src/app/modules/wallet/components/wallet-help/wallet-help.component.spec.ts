import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { WalletHelpComponent } from './wallet-help.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('WalletHelpComponent', () => {
  let component: WalletHelpComponent;
  let fixture: ComponentFixture<WalletHelpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletHelpComponent ],
      imports: [
        SharedModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
