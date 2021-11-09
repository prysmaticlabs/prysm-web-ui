import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SharedModule } from '../../../shared/shared.module';
import { SidebarExpandableLinkComponent } from './sidebar-expandable-link.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SidebarExpandableLinkComponent', () => {
  let component: SidebarExpandableLinkComponent;
  let fixture: ComponentFixture<SidebarExpandableLinkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        BrowserAnimationsModule
      ],
      declarations: [
        SidebarExpandableLinkComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarExpandableLinkComponent);
    component = fixture.componentInstance;
    component.link = {
      name: 'Wallet',
      icon: 'whatshot',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
