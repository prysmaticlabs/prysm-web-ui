import { Component } from '@angular/core';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';

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

  performance$ = this.validatorService.performance$;
}
