import { Component } from '@angular/core';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ValidatorPerformanceResponse } from 'src/app/proto/eth/v1alpha1/beacon_chain';

interface PerformanceData {
  averageValidatorBalance: number;
  averageInclusionDistance: number;
  correctlyVotedHeadPercent: number;
  overallScore: string;
  numValidatingKeys: number;
  recentEpochGains: number;
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
  ) { }

  performanceData$: Observable<PerformanceData> = this.validatorService.performance$.pipe(
    map((res: ValidatorPerformanceResponse) => {
      const epochGains = res.balancesAfterEpochTransition.reduce(
        (a, b) => a + b, 0,
      ) - res.balancesBeforeEpochTransition.reduce(
        (a, b) => a + b, 0
      );
      const votedHeadPercentage = res.correctlyVotedHead.filter(Boolean).length / 
        res.correctlyVotedHead.length;
      let score;
      if (votedHeadPercentage === 1) {
        score = 'Perfect';
      } else if (votedHeadPercentage >= 0.95) {
        score = 'Great';
      } else if (votedHeadPercentage >= 0.80 && votedHeadPercentage < 0.95) {
        score = 'Good';
      } else {
        score = 'Poor';
      }
      return {
        averageValidatorBalance: res.averageActiveValidatorBalance,
        averageInclusionDistance: 2.5,
        correctlyVotedHeadPercent: (votedHeadPercentage * 100),
        overallScore: score,
        numValidatingKeys: 8,
        recentEpochGains: epochGains,
      } as PerformanceData;
    })
  );
}
