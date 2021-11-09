import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { AccountSelectionsComponent } from './account-selections.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AccountSelectionsComponent', () => {
  let component: AccountSelectionsComponent;
  let fixture: ComponentFixture<AccountSelectionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AccountSelectionsComponent],
      imports: [SharedModule, BrowserAnimationsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSelectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
