import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockService } from 'ng-mocks';
import { NgxFileDropModule } from 'ngx-file-drop';
import { of } from 'rxjs';


import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ImportKeystoresRequest } from 'src/app/proto/validator/accounts/v2/web_api';
import { ImportComponent } from './import.component';


describe('ImportComponent', () => {
  let component: ImportComponent;
  let fixture: ComponentFixture<ImportComponent>;
  let service: WalletService = MockService(WalletService);
  let router: Router;

  const fb:FormBuilder = new FormBuilder();

  beforeEach(waitForAsync(() => {
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
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: FormBuilder, useValue: fb }
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
    const keystoresImportedData = ['a', 'b'];
    const keystoresPassword = 'Passw0rdz2020$';

    const keysImportedForm = fb.group({
      keystoresImported:fb.array([
        fb.group({
          pubkeyShort: '',
          isSelected:false,
          hide: true,
          fileName: '',
          keystore: keystoresImportedData[0],
          keystorePassword: keystoresPassword
        }),
        fb.group({
          pubkeyShort: '',
          isSelected:false,
          hide: true,
          fileName: '',
          keystore: keystoresImportedData[1],
          keystorePassword: keystoresPassword
        })
      ])
    });

    component.keystoresFormGroup = keysImportedForm;
    component.slashingProtection?.toggleImportSlashingProtection(false);
    component.submit();
    fixture.detectChanges();
    const req: ImportKeystoresRequest = {
      keystores_imported: keystoresImportedData.map(keystore => JSON.stringify(keystore)),
      keystores_password: keystoresPassword,
    };
    expect(service.importKeystores).toHaveBeenCalledWith(req);
  });
});
