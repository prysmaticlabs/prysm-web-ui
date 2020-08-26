import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportAccountsComponent } from './import-accounts.component';

describe('ImportAccountsComponent', () => {
  let component: ImportAccountsComponent;
  let fixture: ComponentFixture<ImportAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportAccountsComponent ]
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
