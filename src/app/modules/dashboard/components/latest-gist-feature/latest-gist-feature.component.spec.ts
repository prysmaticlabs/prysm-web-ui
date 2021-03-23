import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestGistFeatureComponent } from './latest-gist-feature.component';
import { SharedModule } from '../../../shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LatestGistFeatureComponent', () => {
  let component: LatestGistFeatureComponent;
  let fixture: ComponentFixture<LatestGistFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LatestGistFeatureComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestGistFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
