import { Component } from '@angular/core';
import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { ValidatorQueue } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { map } from 'rxjs/operators';
import { zip } from 'rxjs';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { SECONDS_PER_EPOCH } from 'src/app/modules/core/constants';

interface QueueData {
  churnLimit: Array<number>;
  activationIndices: Set<number>;
  activationPublicKeys: Set<Uint8Array>;
  exitIndices: Set<number>;
  exitPublicKeys: Set<Uint8Array>;
  secondsLeftInQueue: number;
  userValidatingPublicKeys: Set<Uint8Array>;
}

@Component({
  selector: 'app-activation-queue',
  templateUrl: './activation-queue.component.html',
  styles: [
  ]
})
export class ActivationQueueComponent {
  constructor(
    private validatorService: ValidatorService,
    private walletService: WalletService,
  ) { }
  
  validatingPublicKeys$ = this.walletService.validatingPublicKeys$;

  queueData$ = zip(
    this.walletService.validatingPublicKeys$,
    this.validatorService.activationQueue$
  ).pipe(
    map(([validatingKeys, queue]) => this.transformData(validatingKeys, queue)),
  );

  private intersect<T>(a: Set<T>, b: Set<T>): Set<T> {
    return new Set(
      [...a].filter(x => b.has(x)),
    );
  }

  userKeysAwaitingActivation(
    queueData: QueueData,
  ): Set<Uint8Array> {
    // We return the set intersection of those keys in the
    // queue with the user's validating public keys.
    return this.intersect<Uint8Array>(
      queueData.userValidatingPublicKeys, queueData.activationPublicKeys
    );
  }

  userKeysAwaitingExit(
    queueData: QueueData,
  ): Set<Uint8Array> {
    // We return the set intersection of those keys in the
    // queue with the user's validating public keys.
    return this.intersect<Uint8Array>(
      queueData.userValidatingPublicKeys, queueData.exitPublicKeys
    );
  }

  transformData(validatingKeys: Uint8Array[], queue: ValidatorQueue): QueueData {
    const userValidatingKeysSet = new Set<Uint8Array>();
    validatingKeys.forEach((key, idx) => {
      userValidatingKeysSet.add(key);
    });

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
    let secondsLeftInQueue: number;
    const queueLength = 11323;
    if (queue.churnLimit >= queueLength) {
      secondsLeftInQueue = 1;
    }
    const epochsLeft = queueLength / queue.churnLimit;
    secondsLeftInQueue = epochsLeft * SECONDS_PER_EPOCH;
    return {
      churnLimit: Array.from({ length: queue.churnLimit }),
      activationIndices: activationIndicesSet,
      activationPublicKeys: activationKeysSet,
      exitIndices: exitIndicesSet,
      exitPublicKeys: exitKeysSet,
      secondsLeftInQueue,
      userValidatingPublicKeys: userValidatingKeysSet,
    };
  }
}
