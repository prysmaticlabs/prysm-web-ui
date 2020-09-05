import { Component, OnInit } from '@angular/core';

import { ValidatorService } from '../../../core/services/validator.service';
import { tap, take } from 'rxjs/operators';

@Component({
  selector: 'app-gains-and-losses',
  templateUrl: './gains-and-losses.component.html',
})
export class GainsAndLossesComponent implements OnInit {

  constructor(
    private validatorService: ValidatorService,
  ) { }

  ngOnInit(): void {
    this.validatorService.recentEpochBalances().pipe(
      tap((res) => console.log(res)),
      take(1),
    ).subscribe();
  }
}
