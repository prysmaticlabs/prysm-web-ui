import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GenerateMnemonicComponent } from './generate-mnemonic.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';

describe('GenerateMnemonicComponent', () => {
  let component: GenerateMnemonicComponent;
  let fixture: ComponentFixture<GenerateMnemonicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateMnemonicComponent ],
      imports: [
        SharedModule,
        HttpClientTestingModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateMnemonicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
