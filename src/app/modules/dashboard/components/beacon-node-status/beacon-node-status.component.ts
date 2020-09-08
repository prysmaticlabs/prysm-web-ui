import { Component, Input } from '@angular/core';
import { BeaconNodeService } from 'src/app/modules/core/services/beacon-node.service';

@Component({
  selector: 'app-beacon-node-status',
  templateUrl: './beacon-node-status.component.html',
  styles: [
  ]
})
export class BeaconNodeStatusComponent {
  constructor(
    private beaconNodeService: BeaconNodeService,
  ) { }
  endpoint$ = this.beaconNodeService.nodeEndpoint$;
  connected$ = this.beaconNodeService.connected$;
  syncing$ = this.beaconNodeService.syncing$;
}
