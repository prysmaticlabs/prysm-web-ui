import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockService } from 'ng-mocks';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { CreateAccountComponent } from './create-account.component';

describe('CreateAccountComponent', () => {
  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;
  let service: WalletService = MockService(WalletService);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAccountComponent],
      imports: [
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: WalletService, useValue: service },
      ]
    })
    .compileComponents();
    service = TestBed.inject(WalletService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
