import { Component, OnInit } from '@angular/core';

import { switchMap, shareReplay } from 'rxjs/operators';

import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { BeaconNodeService } from 'src/app/modules/core/services/beacon-node.service';
import {
  ChainHead,
} from 'src/app/proto/eth/v1alpha1/beacon_chain';

@Component({
  selector: 'app-gains-and-losses',
  templateUrl: './gains-and-losses.component.html',
})
export class GainsAndLossesComponent implements OnInit {
  constructor(
    private validatorService: ValidatorService,
    private beaconNodeService: BeaconNodeService,
  ) { }

  balances$ = this.beaconNodeService.chainHead$.pipe(
    switchMap((head: ChainHead) =>
      this.validatorService.recentEpochBalances(head.headEpoch, 3 /* lookback */)
    ),
    shareReplay(1),
  );

  ngOnInit(): void {
  }
}
