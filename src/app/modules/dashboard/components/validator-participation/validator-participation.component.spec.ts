import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorParticipationComponent } from './validator-participation.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';

describe('ValidatorParticipationComponent', () => {
  let component: ValidatorParticipationComponent;
  let fixture: ComponentFixture<ValidatorParticipationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidatorParticipationComponent ],
      imports: [
        SharedModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorParticipationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
