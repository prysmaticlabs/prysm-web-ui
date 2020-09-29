import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSelectedAccountsComponent } from './delete-selected-accounts.component';

describe('DeleteSelectedAccountsComponent', () => {
  let component: DeleteSelectedAccountsComponent;
  let fixture: ComponentFixture<DeleteSelectedAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteSelectedAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSelectedAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
