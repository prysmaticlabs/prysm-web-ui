import { Component, OnInit } from '@angular/core';

import { tap, take, switchMap } from 'rxjs/operators';

import { ValidatorService } from '../../../core/services/validator.service';
import { BeaconNodeService } from '../../../core/services/beacon-node.service';
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

  ngOnInit(): void {
    this.beaconNodeService.chainHead$.pipe(
      switchMap((head: ChainHead) =>
        this.validatorService.recentEpochBalances(head.headEpoch, 5 /* lookback */)
      ),
      take(1),
      tap((res) => console.log(res)),
    ).subscribe();
  }
}
