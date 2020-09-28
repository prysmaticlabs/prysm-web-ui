import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportAccountsFormComponent } from './import-accounts-form.component';

describe('ImportAccountsFormComponent', () => {
  let component: ImportAccountsFormComponent;
  let fixture: ComponentFixture<ImportAccountsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportAccountsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAccountsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
