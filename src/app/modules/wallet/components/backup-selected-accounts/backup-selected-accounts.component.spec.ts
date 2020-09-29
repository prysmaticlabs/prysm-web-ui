import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupSelectedAccountsComponent } from './backup-selected-accounts.component';

describe('BackupSelectedAccountsComponent', () => {
  let component: BackupSelectedAccountsComponent;
  let fixture: ComponentFixture<BackupSelectedAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackupSelectedAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackupSelectedAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
