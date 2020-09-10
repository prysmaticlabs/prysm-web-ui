import { Component, OnInit, OnDestroy } from '@angular/core';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { ValidatorQueue } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { map, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface QueueData {
  churnLimit: number;
  activationIndices: Set<number>;
  activationPublicKeys: Set<Uint8Array>;
  exitIndices: Set<number>;
  exitPublicKeys: Set<Uint8Array>;
}

@Component({
  selector: 'app-activation-queue',
  templateUrl: './activation-queue.component.html',
  styles: [
  ]
})
export class ActivationQueueComponent implements OnInit, OnDestroy {
  constructor(
    private validatorService: ValidatorService,
  ) { }
  
  private destroyed$$ = new Subject<void>();
  private queueData: QueueData;

  ngOnInit(): void {
    this.validatorService.activationQueue$.pipe(
      map(this.transformData.bind(this)),
      tap((queueData: QueueData) => this.queueData = queueData),
      takeUntil(this.destroyed$$),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$$.next();
    this.destroyed$$.complete();
  }

  transformData(queue: ValidatorQueue): QueueData {
    const activationKeysSet = new Set<Uint8Array>();
    const activationIndicesSet = new Set<number>();
    const exitKeysSet = new Set<Uint8Array>();
    const exitIndicesSet = new Set<number>();

    queue.activationPublicKeys.forEach((key, idx) => {
      activationKeysSet.add(key);
      activationIndicesSet.add(queue.activationValidatorIndices[idx]);
    });
    queue.exitPublicKeys.forEach((key, idx) => {
      exitKeysSet.add(key);
      exitIndicesSet.add(queue.exitValidatorIndices[idx]);
    });
    return {
      churnLimit: queue.churnLimit,
      activationIndices: activationIndicesSet,
      activationPublicKeys: activationKeysSet,
      exitIndices: exitIndicesSet,
      exitPublicKeys: exitKeysSet,
    };
  }
}
