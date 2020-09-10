import { Component, OnInit } from '@angular/core';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-activation-queue',
  templateUrl: './activation-queue.component.html',
  styles: [
  ]
})
export class ActivationQueueComponent implements OnInit {
  constructor(
    private validatorService: ValidatorService,
  ) { }

  ngOnInit(): void {
    this.validatorService.activationQueue$.pipe(
      tap(console.log),
      take(1),
    ).subscribe();
  }
}
