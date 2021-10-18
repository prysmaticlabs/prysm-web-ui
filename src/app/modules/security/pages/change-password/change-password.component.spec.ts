import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ChangePasswordRequest } from 'src/app/proto/validator/accounts/v2/web_api';

import { ChangePasswordComponent } from './change-password.component';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  const service: AuthenticationService = MockService(AuthenticationService);
  service.changeUIPassword = (req: ChangePasswordRequest) => of();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChangePasswordComponent,
      ],
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
      ],
      providers: [
        { provide: AuthenticationService, useValue: service },
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
