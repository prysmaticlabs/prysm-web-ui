import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { WalletKindComponent } from './wallet-kind.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('WalletKindComponent', () => {
  let component: WalletKindComponent;
  let fixture: ComponentFixture<WalletKindComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletKindComponent ],
      imports: [
        SharedModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletKindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
