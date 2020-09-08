import { Component, OnInit } from '@angular/core';

import { switchMap, take, tap } from 'rxjs/operators';

import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import {
  ChainHead,
} from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { BeaconNodeService } from 'src/app/modules/core/services/beacon-node.service';

@Component({
  selector: 'app-gains-and-losses',
  templateUrl: './gains-and-losses.component.html',
})
export class GainsAndLossesComponent implements OnInit {
  constructor(
    private validatorService: ValidatorService,
    private beaconService: BeaconNodeService,
  ) { }


  ngOnInit(): void {
    this.beaconService.chainHead$.pipe(
      switchMap((head: ChainHead) =>
        this.validatorService.recentEpochBalances(head.headEpoch, 3 /* lookback */)
      ),
      take(1),
      tap((res) => console.log(res)),
    ).subscribe();
  }
}
