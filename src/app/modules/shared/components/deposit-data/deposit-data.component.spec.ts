import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PrettyjsonPipe } from '../../pipes/pretty-json.pipe';

import { DepositDataComponent } from './deposit-data.component';

describe('DepositDataComponent', () => {
  let component: DepositDataComponent;
  let fixture: ComponentFixture<DepositDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DepositDataComponent,
        PrettyjsonPipe,
      ],
      imports: [
        MatSnackBarModule,
        MatIconModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
