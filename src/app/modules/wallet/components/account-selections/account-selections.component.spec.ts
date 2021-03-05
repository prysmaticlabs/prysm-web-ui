import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { AccountSelectionsComponent } from './account-selections.component';

describe('AccountSelectionsComponent', () => {
  let component: AccountSelectionsComponent;
  let fixture: ComponentFixture<AccountSelectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountSelectionsComponent],
      imports: [
        SharedModule,
        BrowserAnimationsModule,
      ]
    })
    .compileComponents();
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
