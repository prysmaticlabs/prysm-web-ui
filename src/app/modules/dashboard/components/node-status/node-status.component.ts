import { Component } from '@angular/core';
import { NodeService } from 'src/app/modules/core/services/node.service';

@Component({
  selector: 'app-node-status',
  templateUrl: './node-status.component.html',
  styles: [
  ]
})
export class NodeStatusComponent {
  constructor(private nodeService: NodeService) { }
  nodeConnection$ = this.nodeService.conn$;
}
