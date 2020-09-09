import { Component } from '@angular/core';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BigNumber } from 'ethers';

import { BeaconNodeService } from 'src/app/modules/core/services/beacon-node.service';
import { ValidatorPerformanceResponse } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { WalletService } from 'src/app/modules/core/services/wallet.service';

const GWEI_PER_ETHER = 1000000000;
const FAR_FUTURE_EPOCH = '18446744073709551615';

interface data {
  averageEffectiveBalance: number;
  averageInclusionDistance: number;
  correctlyVotedHeadPercent: number;
  overallScore: string;
  numValidatingKeys: number;
  recentEpochGains: number;
  connectedPeers: number;
  totalPeers: number;
}

@Component({
  selector: 'app-validator-performance-summary',
  templateUrl: './validator-performance-summary.component.html',
  styles: [
  ]
})
export class ValidatorPerformanceSummaryComponent {
  constructor(
    private validatorService: ValidatorService,
    private walletService: WalletService,
    private beaconNodeService: BeaconNodeService,
  ) { }

  tooltips = {
    effectiveBalance: 'Describes your average validator balance across your active validating keys',
    inclusionDistance: `This is the average number of slots it takes for your validator's attestations to get included in blocks. The lower this number, the better your rewards will be. 1 is the optimal inclusion distance`,
    recentEpochGains: `This summarizes your total gains in ETH over the last epoch (approximately 6 minutes ago), which will give you an approximation of most recent performance`,
    correctlyVoted: `The number of times in an epoch your validators voted correctly on the chain head vs. the total number of times they voed`,
    keys: `Total number of active validating keys in your wallet`,
    score: `A subjective scale from Perfect, Great, Good, to Poor which qualifies how well your validators are performing on average in terms of correct votes in recent epochs`,
    connectedPeers: `Number of connected peers in your beacon node`,
    totalPeers: `Total number of peers in your beacon node, which includes disconnected, connecting, idle, peers`,
  };

  validatingKeys$ = this.walletService.validatingPublicKeys$;
  peers$ = this.beaconNodeService.peers$.pipe(
    map(p => p.peers),
    shareReplay(1),
  );
  connectedPeers$ = this.peers$.pipe(
    map(peers => peers.filter(p => p.connectionState.toString() === 'CONNECTED')), 
  );
  performanceData$: Observable<data> = this.validatorService.performance$.pipe(
    map(this.transformPerformanceData.bind(this)),
  );


  private transformPerformanceData(perf: ValidatorPerformanceResponse): data {
    const recentEpochGains = this.computeEpochGains(
      perf.balancesBeforeEpochTransition, perf.balancesAfterEpochTransition,
    );
    const averageEffectiveBalance = this.computeAverageEffectiveBalance(
      perf.currentEffectiveBalances
    );
    const votedHeadPercentage = perf.correctlyVotedHead.filter(Boolean).length / 
      perf.correctlyVotedHead.length;

    const averageInclusionDistance = perf.inclusionDistances.reduce((prev, curr) => {
      if (curr.toString() === FAR_FUTURE_EPOCH) {
        return prev;
      }
      return prev + Number.parseInt(curr.toString());
    }, 0) / perf.inclusionDistances.length;
    let overallScore;
    if (votedHeadPercentage === 1) {
      overallScore = 'Perfect';
    } else if (votedHeadPercentage >= 0.95) {
      overallScore = 'Great';
    } else if (votedHeadPercentage >= 0.80 && votedHeadPercentage < 0.95) {
      overallScore = 'Good';
    } else {
      overallScore = 'Poor';
    }
    return {
      averageEffectiveBalance,
      averageInclusionDistance,
      correctlyVotedHeadPercent: (votedHeadPercentage * 100),
      overallScore,
      numValidatingKeys: 8,
      recentEpochGains,
    } as data;
  }

  private computeAverageEffectiveBalance(balances: number[]): number {
    const effBalances = balances.map(num => BigNumber.from(num));
    const total = effBalances.reduce((prev, curr) => prev.add(curr), BigNumber.from('0'));
    return total.div(BigNumber.from(balances.length)).div(GWEI_PER_ETHER).toNumber();
  }

  private computeEpochGains(pre: number[], post: number[]): number {
    const beforeTransition = pre.map(num => BigNumber.from(num));
    const afterTransition = post.map(num => BigNumber.from(num));
    if (beforeTransition.length != afterTransition.length) {
      throw new Error('Number of balances before and after epoch transition are different');
    }
    const diffInEth = afterTransition.map((num: BigNumber, idx: number) => {
      return num.sub(beforeTransition[idx]);
    })
    const gainsInGwei = diffInEth.reduce((prev, curr) => prev.add(curr), BigNumber.from('0'));
    return gainsInGwei.toNumber() / GWEI_PER_ETHER;
  }
}