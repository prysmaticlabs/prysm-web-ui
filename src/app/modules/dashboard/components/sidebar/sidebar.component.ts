import { Component, Input } from '@angular/core';
import SidebarLink from '../../types/sidebar-link';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  @Input() links: SidebarLink[] | null = null;
}
