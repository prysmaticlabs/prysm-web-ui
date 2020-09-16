import { Component, Input } from '@angular/core';
import SidebarLink from '../../types/sidebar-link';

@Component({
  selector: 'app-sidebar-expandable-link',
  templateUrl: './sidebar-expandable-link.component.html',
})
export class SidebarExpandableLinkComponent {
  @Input() link: SidebarLink | null = null;
  collapsed = true;

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }
}
