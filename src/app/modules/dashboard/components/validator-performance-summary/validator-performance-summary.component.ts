import { Component } from '@angular/core';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { Observable } from 'rxjs';
import { map, share, filter, shareReplay } from 'rxjs/operators';
import { BeaconNodeService } from 'src/app/modules/core/services/beacon-node.service';
import { ConnectionState, Peers } from 'src/app/proto/eth/v1alpha1/node';
import { ValidatorPerformanceResponse } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { WalletService } from 'src/app/modules/core/services/wallet.service';

interface data {
  averageValidatorBalance: number;
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
    balances: 'Describes your average validator balance across your active validating keys',
    inclusionDistance: `This is the average number of slots it takes for your validator's attestations to get included in blocks. The lower this number, the better your rewards will be. 2 is the optimal inclusion distance`,
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
    map(peers => peers.filter(p => p.connectionState === ConnectionState.CONNECTED)),
  );
  performanceData$: Observable<data> = this.validatorService.performance$.pipe(
    map(this.transformPerformanceData),
  );


  private transformPerformanceData(perf: ValidatorPerformanceResponse): data {
    const sum = (a: number, b: number) => a + b;
    const recentEpochGains = perf.balancesAfterEpochTransition.reduce(
      sum, 0
    ) - perf.balancesBeforeEpochTransition.reduce(
      sum, 0
    );
    const votedHeadPercentage = perf.correctlyVotedHead.filter(Boolean).length / 
      perf.correctlyVotedHead.length;
    const averageInclusionDistance = perf.inclusionDistances.reduce(sum, 0) / perf.inclusionDistances.length;
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
      averageValidatorBalance: perf.averageActiveValidatorBalance,
      averageInclusionDistance,
      correctlyVotedHeadPercent: (votedHeadPercentage * 100),
      overallScore,
      numValidatingKeys: 8,
      recentEpochGains,
    } as data;
  }
}
