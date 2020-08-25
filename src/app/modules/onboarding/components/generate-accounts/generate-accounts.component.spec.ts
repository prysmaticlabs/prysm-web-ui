import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateAccountsComponent } from './generate-accounts.component';

describe('GenerateAccountsComponent', () => {
  let component: GenerateAccountsComponent;
  let fixture: ComponentFixture<GenerateAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateAccountsComponent ]
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
