import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateAccountsComponent } from './generate-accounts.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';

describe('GenerateAccountsComponent', () => {
  let component: GenerateAccountsComponent;
  let fixture: ComponentFixture<GenerateAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateAccountsComponent ],
      imports: [ SharedModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
