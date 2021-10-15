import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockService } from 'ng-mocks';
import { Observable, of } from 'rxjs';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { SharedModule } from '../../../shared/shared.module';
import { VersionComponent } from './version.component';

describe('VersionComponent', () => {
  const validatorService = MockService(ValidatorService);
  let component: VersionComponent;
  let fixture: ComponentFixture<VersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        {provide: ValidatorService, useValue: validatorService}
      ],
      declarations: [
        VersionComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    validatorService.version$ = of({beacon: 'test', validator: 'test'});
    fixture = TestBed.createComponent(VersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
