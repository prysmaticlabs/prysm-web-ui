import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockService } from 'ng-mocks';
import { NgxFileDropModule } from 'ngx-file-drop';
import { of } from 'rxjs';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ImportKeystoresRequest, ImportKeystoresResponse } from 'src/app/proto/validator/accounts/v2/web_api';

import { ImportComponent } from './import.component';

describe('ImportComponent', () => {
  let component: ImportComponent;
  let fixture: ComponentFixture<ImportComponent>;
  let service: WalletService = MockService(WalletService);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ImportComponent,
      ],
      imports: [
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        NgxFileDropModule,
      ],
      providers: [
        { provide: WalletService, useValue: service },
      ]
    })
    .compileComponents();
    service = TestBed.inject(WalletService);
  }));

  beforeEach(() => {
    spyOn(service, 'importKeystores').and.returnValue(of({} as ImportKeystoresResponse));
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
    component.importFormGroup.controls.keystoresImported.setValue(keystoresImported);
    component.passwordFormGroup.controls.keystoresPassword.setValue(keystoresPassword);
    component.submit();
    fixture.detectChanges();
    const req: ImportKeystoresRequest = {
      keystoresImported,
      keystoresPassword,
    };
    expect(service.importKeystores).toHaveBeenCalledWith(req);
  });
});
