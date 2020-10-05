import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { WalletKindComponent } from './wallet-kind.component';

describe('WalletKindComponent', () => {
  let component: WalletKindComponent;
  let fixture: ComponentFixture<WalletKindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletKindComponent ],
      imports: [
        SharedModule,
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
