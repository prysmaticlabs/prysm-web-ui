import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BigNumber } from 'ethers';

import { ChainService } from 'src/app/modules/core/services/chain.service';
import { ValidatorParticipationResponse } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { GWEI_PER_ETHER } from 'src/app/modules/core/constants';

interface ParticipationData {
  rate: number;
  epoch: number;
  totalVotedETH: number;
  totalEligibleETH: number;
}

@Component({
  selector: 'app-validator-participation',
  templateUrl: './validator-participation.component.html',
  styles: [
  ]
})
export class ValidatorParticipationComponent {
  constructor(
    private chainService: ChainService,
  ) { }
  participation$: Observable<ParticipationData> = this.chainService.participation$.pipe(
    map(this.transformParticipationData.bind(this)),
  );
  noFinalityMessage = `If participation drops below 66%, the chain cannot finalize blocks and validator balances will begin to decrease for all inactive validators at a fast rate`;

  updateProgressColor(progress: number): string {
    if (progress < 66.6) {
       return 'warn';
    } else if (progress >= 66.6 && progress < 75) {
       return 'accent';
    } else {
      return 'primary';
    }
 }

  // We transform necessary data for displaying in the component.
  // IMPORTANT NOTE: votedEther and eligibleEther in the ValidatorParticipationResponse
  // fields are incorrectly named. They are actually represented in gwei.
  private transformParticipationData(res: ValidatorParticipationResponse): ParticipationData {
    if (!res || !res.participation) {
      return {} as ParticipationData;
    }
    return {
      rate: (res.participation.globalParticipationRate * 100),
      epoch: res.epoch,
      totalVotedETH: this.gweiToETH(res.participation.votedEther).toNumber(),
      totalEligibleETH: this.gweiToETH(res.participation.eligibleEther).toNumber(),
    } as ParticipationData;
  }

  private gweiToETH(num: string): BigNumber {
    return BigNumber.from(num).div(GWEI_PER_ETHER);
  }
}
