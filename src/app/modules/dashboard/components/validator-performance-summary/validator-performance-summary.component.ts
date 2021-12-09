import { ChangeDetectorRef, Component } from '@angular/core';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BeaconNodeService } from 'src/app/modules/core/services/beacon-node.service';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { ValidatorBalances, ValidatorSummaryResponse } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { ValidatorStatus, validatorStatusFromJSON } from 'src/app/proto/eth/v1alpha1/validator';



export interface PerformanceData {
  correctlyVotedHeadPercent: number;
  overallScore: string;
  recentEpochGains: string;
  totalBalance: string;
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
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  loading = true;
  hasError = false;
  noData = false;

  tooltips = {
    totalBalance: 'Describes your total validator balance across all your active validating keys',
    recentEpochGains: `This summarizes your total gains in ETH over the last epoch (approximately 6 minutes ago), which will give you an approximation of most recent performance`,
    correctlyVoted: `The number of times in an epoch your validators voted correctly on the chain head vs. the total number of times they voted`,
    keys: `Total number of active validating keys in your wallet`,
    score: `A subjective scale from Perfect, Great, Good, to Poor which qualifies how well your validators are performing on average in terms of correct votes in recent epochs`,
    connectedPeers: `Number of connected peers in your beacon node`,
    totalPeers: `Total number of peers in your beacon node, which includes disconnected, connecting, idle peers`,
  };

  validatingKeys$ = this.walletService.validatingPublicKeys$;
  peers$ = this.beaconNodeService.peers$.pipe(
    map(p => p.peers),
    shareReplay(1),
  );
  connectedPeers$ = this.peers$.pipe(
    map(peers => peers.filter(p => p.connection_state.toString() === 'CONNECTED')),
  );
  performanceData$: Observable<PerformanceData> = this.validatorService.performance$.pipe(
    map(this.transformPerformanceData.bind(this)),
  );

  private transformPerformanceData(perf: ValidatorSummaryResponse & ValidatorBalances): PerformanceData {
    perf.balances = perf.balances.filter(b => b.status !== "UNKNOWN");
    const totalBalance = perf.balances.reduce(
      (prev, curr) => {
        if (curr && curr.balance) {
          return prev.add(BigNumber.from(curr.balance));
        }
        return prev;
      },
      BigNumber.from('0'),
    );
    const recentEpochGains = this.computeEpochGains(
      perf.balances_before_epoch_transition, perf.balances_after_epoch_transition,
    );
    const totalVotedHead = perf.correctly_voted_head.length;
    let votedHeadPercentage = -1;
    if (totalVotedHead) {
      votedHeadPercentage = perf.correctly_voted_head.filter(Boolean).length /
        perf.correctly_voted_head.length;
    }

    let overallScore;
    if (votedHeadPercentage === 1) {
      overallScore = 'Perfect';
    } else if (votedHeadPercentage >= 0.95) {
      overallScore = 'Great';
    } else if (votedHeadPercentage >= 0.80) {
      overallScore = 'Good';
    } else if (votedHeadPercentage === -1) {
      overallScore = 'N/A';
    } else {
      overallScore = 'Poor';
    }
    this.loading = false;
    this.changeDetectorRef.detectChanges();
    return {
      correctlyVotedHeadPercent: votedHeadPercentage !== -1 ? (votedHeadPercentage * 100) : null,
      overallScore,
      recentEpochGains,
      totalBalance: perf.balances && perf.balances.length !== 0 ? formatUnits(totalBalance, 'gwei').toString() : null,
    } as PerformanceData;
    
  }

  private computeEpochGains(pre: string[], post: string[]): string {
    const beforeTransition = pre.map(num => BigNumber.from(num));
    const afterTransition = post.map(num => BigNumber.from(num));
    if (beforeTransition.length !== afterTransition.length) {
      throw new Error('Number of balances before and after epoch transition are different');
    }
    const diffInEth = afterTransition.map((num: BigNumber, idx: number) => {
      return num.sub(beforeTransition[idx]);
    });
    const gainsInGwei = diffInEth.reduce((prev, curr) => prev.add(curr), BigNumber.from('0'));
    if (gainsInGwei.eq(BigNumber.from('0'))) {
      return '0';
    }
    return formatUnits(gainsInGwei, 'gwei');
  }
}
