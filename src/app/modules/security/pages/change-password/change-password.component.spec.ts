import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ChangePasswordRequest } from 'src/app/proto/validator/accounts/v2/web_api';

import { ChangePasswordComponent } from './change-password.component';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  const service: WalletService = MockService(WalletService);
  service.changeWalletPassword = (req: ChangePasswordRequest) => of();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChangePasswordComponent,
      ],
      imports: [
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
      ],
      providers: [
        { provide: WalletService, useValue: service },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
