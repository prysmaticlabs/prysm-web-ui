import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { AccountsTableComponent } from './accounts-table.component';

describe('AccountsTableComponent', () => {
  let component: AccountsTableComponent;
  let fixture: ComponentFixture<AccountsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountsTableComponent],
      imports: [
        SharedModule,
        BrowserAnimationsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
