import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarExpandableLinkComponent } from './sidebar-expandable-link.component';

describe('SidebarExpandableLinkComponent', () => {
  let component: SidebarExpandableLinkComponent;
  let fixture: ComponentFixture<SidebarExpandableLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarExpandableLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarExpandableLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
