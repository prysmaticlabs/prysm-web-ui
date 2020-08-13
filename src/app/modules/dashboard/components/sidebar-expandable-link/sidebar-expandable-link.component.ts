import { Component, OnInit, Input } from '@angular/core';
import SidebarLink from '../../types/sidebar-link';

@Component({
  selector: 'app-sidebar-expandable-link',
  templateUrl: './sidebar-expandable-link.component.html',
  styleUrls: ['./sidebar-expandable-link.component.scss']
})
export class SidebarExpandableLinkComponent implements OnInit {
  @Input() link: SidebarLink;

  constructor() { }

  ngOnInit(): void {
  }
}
