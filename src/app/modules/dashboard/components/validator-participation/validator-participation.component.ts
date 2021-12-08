import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
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
export class ValidatorParticipationComponent implements OnInit, OnDestroy {
  constructor(
    private chainService: ChainService,
  ) { }
  loading = false;
  participation: ParticipationData | null = null;
  noFinalityMessage = `If participation drops below 66%, the chain cannot finalize blocks and validator balances will begin to decrease for all inactive validators at a fast rate`;
  private destroyed$ = new Subject<void>();

  ngOnInit(): void {
    this.loading = true;
    this.chainService.participation$.pipe(
      map(this.transformParticipationData.bind(this)),
      tap((data: ParticipationData) => {
        this.participation = data;
        this.loading = false;
      }),
      takeUntil(this.destroyed$),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

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
      rate: (res.participation.global_participation_rate * 100),
      epoch: res.epoch,
      totalVotedETH: this.gweiToETH(res.participation.voted_ether).toNumber(),
      totalEligibleETH: this.gweiToETH(res.participation.eligible_ether).toNumber(),
    } as ParticipationData;
  }

  private gweiToETH(num: string): BigNumber {
    return BigNumber.from(num).div(GWEI_PER_ETHER);
  }
}
