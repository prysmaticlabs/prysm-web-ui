import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletConfigComponent } from './wallet-config.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

describe('WalletConfigComponent', () => {
  let component: WalletConfigComponent;
  let fixture: ComponentFixture<WalletConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
      ],
      declarations: [ WalletConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
