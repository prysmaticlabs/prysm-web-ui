import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MnemonicFormComponent } from './mnemonic-form.component';

describe('MnemonicFormComponent', () => {
  let component: MnemonicFormComponent;
  let fixture: ComponentFixture<MnemonicFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MnemonicFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MnemonicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
