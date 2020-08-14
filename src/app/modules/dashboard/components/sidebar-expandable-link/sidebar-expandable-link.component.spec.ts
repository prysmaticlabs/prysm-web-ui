import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '../../../shared/shared.module';
import { SidebarExpandableLinkComponent } from './sidebar-expandable-link.component';

describe('SidebarExpandableLinkComponent', () => {
  let component: SidebarExpandableLinkComponent;
  let fixture: ComponentFixture<SidebarExpandableLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
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
