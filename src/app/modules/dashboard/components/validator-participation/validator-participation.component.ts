import { Component } from '@angular/core';
import { ChainService } from 'src/app/modules/core/services/chain.service';

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
  participation$ = this.chainService.participation$;

  formatParticipation(rate: number): string {
    return (rate * 100).toFixed(2);
  }
}
