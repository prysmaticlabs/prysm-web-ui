import { Component } from '@angular/core';
import { BeaconNodeService } from 'src/app/modules/core/services/beacon-node.service';

import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-beacon-node-status',
  templateUrl: './beacon-node-status.component.html',
  styles: [
  ]
})
export class BeaconNodeStatusComponent {
  constructor(private nodeService: BeaconNodeService) { }
  nodeConnection$ = this.nodeService.statusPoll$.pipe(
    tap(() => console.log('fired')),
  );
}
