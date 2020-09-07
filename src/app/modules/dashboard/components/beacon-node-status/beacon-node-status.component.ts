import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { NodeConnectionResponse } from 'src/app/proto/validator/accounts/v2/web_api';

@Component({
  selector: 'app-beacon-node-status',
  templateUrl: './beacon-node-status.component.html',
  styles: [
  ]
})
export class BeaconNodeStatusComponent {
  @Input() beaconNodeState$: Observable<NodeConnectionResponse>;
  constructor() { }
}
