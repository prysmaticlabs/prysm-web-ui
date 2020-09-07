import { Component } from '@angular/core';
import { BeaconNodeService } from 'src/app/modules/core/services/beacon-node.service';

@Component({
  selector: 'app-beacon-node-status',
  templateUrl: './beacon-node-status.component.html',
  styles: [
  ]
})
export class BeaconNodeStatusComponent {
  constructor(private nodeService: BeaconNodeService) { }
  connected$ = this.nodeService.beaconNodeConnected$;
  syncing$ = this.nodeService.beaconNodeSyncing$;
  endpoint$ = this.nodeService.beaconNodeEndpoint$;
}
