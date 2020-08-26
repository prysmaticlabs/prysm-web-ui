import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MockComponent } from 'ng-mocks';
import { NgxFileDropComponent } from 'ngx-file-drop';

import { ImportAccountsComponent } from './import-accounts.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';

describe('ImportAccountsComponent', () => {
  let component: ImportAccountsComponent;
  let fixture: ComponentFixture<ImportAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ImportAccountsComponent,
        MockComponent(NgxFileDropComponent),
      ],
      imports: [
        SharedModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
