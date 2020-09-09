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
      const sum = (a: number, b: number) => a + b;
      const recentEpochGains = res.balancesAfterEpochTransition.reduce(
        sum, 0
      ) - res.balancesBeforeEpochTransition.reduce(
        sum, 0
      );
      const votedHeadPercentage = res.correctlyVotedHead.filter(Boolean).length / 
        res.correctlyVotedHead.length;
      const averageInclusionDistance = res.inclusionDistances.reduce(sum, 0) / res.inclusionDistances.length;
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
        averageValidatorBalance: res.averageActiveValidatorBalance,
        averageInclusionDistance,
        correctlyVotedHeadPercent: (votedHeadPercentage * 100),
        overallScore,
        numValidatingKeys: 8,
        recentEpochGains,
      } as PerformanceData;
    })
  );
}
