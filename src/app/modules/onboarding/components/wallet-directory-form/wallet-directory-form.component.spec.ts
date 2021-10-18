import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockService } from 'ng-mocks';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { WalletDirectoryFormComponent } from './wallet-directory-form.component';

describe('WalletDirectoryFormComponent', () => {
  let component: WalletDirectoryFormComponent;
  let fixture: ComponentFixture<WalletDirectoryFormComponent>;
  const service: WalletService = MockService(WalletService);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [ WalletDirectoryFormComponent ],
      providers: [
        { provide: WalletService, useValue: service }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletDirectoryFormComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormBuilder().group({
      walletDir: ['', Validators.required]
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
