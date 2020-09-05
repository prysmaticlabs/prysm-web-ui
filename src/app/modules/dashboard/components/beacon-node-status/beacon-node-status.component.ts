import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BeaconNodeService, BeaconState } from 'src/app/modules/core/services/beacon-node.service';
import { ValidatorBalances } from '../../../../proto/eth/v1alpha1/beacon_chain';

@Component({
  selector: 'app-beacon-node-status',
  templateUrl: './beacon-node-status.component.html',
  styles: [
  ]
})
export class BeaconNodeStatusComponent {
  beaconNodeState: BeaconState = this.nodeService.beaconNodeState;
  constructor(private nodeService: BeaconNodeService) {
  }
}
