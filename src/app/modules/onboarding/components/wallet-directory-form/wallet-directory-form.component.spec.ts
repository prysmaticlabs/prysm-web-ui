import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletDirectoryFormComponent } from './wallet-directory-form.component';

describe('WalletDirectoryFormComponent', () => {
  let component: WalletDirectoryFormComponent;
  let fixture: ComponentFixture<WalletDirectoryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletDirectoryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletDirectoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
