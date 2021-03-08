import { APP_BASE_HREF } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockService } from 'ng-mocks';
import { NgxFileDropModule } from 'ngx-file-drop';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthenticationService } from 'src/app/modules/core/services/authentication.service';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ImportKeystoresRequest } from 'src/app/proto/validator/accounts/v2/web_api';

import { ImportComponent } from './import.component';


describe('ImportComponent', () => {
  let component: ImportComponent;
  let fixture: ComponentFixture<ImportComponent>;
  let authService: AuthenticationService;
  let service: WalletService = MockService(WalletService);
  let router: Router;

  beforeEach(async(() => {

    authService = MockService(AuthenticationService);
    authService.prompt = (LoginComponent, SignupComponent): Observable<null> => {
      return new BehaviorSubject(null).asObservable();
    };
    TestBed.configureTestingModule({
      declarations: [
        ImportComponent,
      ],
      imports: [
        RouterTestingModule,
        SharedModule,
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        NgxFileDropModule,
      ],
      providers: [
        { provide: WalletService, useValue: service },
        { provide: AuthenticationService, useValue: authService },
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    })
    .compileComponents();
    service = TestBed.inject(WalletService);
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    spyOn(service, 'importKeystores').and.returnValue(of());
    fixture = TestBed.createComponent(ImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the keystores import function upon form submit', () => {
    const keystoresImported = ['a', 'b'];
    const keystoresPassword = 'Passw0rdz2020$';
    component.keystoresFormGroup.controls.keystoresImported.setValue(keystoresImported);
    component.keystoresFormGroup.controls.keystoresPassword.setValue(keystoresPassword);
    component.submit();
    fixture.detectChanges();
    const req: ImportKeystoresRequest = {
      keystoresImported,
      keystoresPassword,
    };
    expect(service.importKeystores).toHaveBeenCalledWith(req);
  });
});
