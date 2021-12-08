import { Component } from '@angular/core';

import { map } from 'rxjs/operators';
import { zip } from 'rxjs';
import intersect from 'src/app/modules/core/utils/intersect';

import { ValidatorQueue } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { SECONDS_PER_EPOCH } from 'src/app/modules/core/constants';
import { ChainService } from 'src/app/modules/core/services/chain.service';

export interface QueueData {
  originalData: ValidatorQueue;
  churnLimit: Array<number>;
  activationPublicKeys: Set<string>;
  exitPublicKeys: Set<string>;
  secondsLeftInQueue: number;
  userValidatingPublicKeys: Set<string>;
}

@Component({
  selector: 'app-activation-queue',
  templateUrl: './activation-queue.component.html',
  styles: [
  ]
})
export class ActivationQueueComponent {
  constructor(
    private chainService: ChainService,
    private walletService: WalletService,
  ) { }

  validatingPublicKeys$ = this.walletService.validatingPublicKeys$;

  queueData$ = zip(
    this.walletService.validatingPublicKeys$,
    this.chainService.activationQueue$
  ).pipe(
    map(([validatingKeys, queue]) => this.transformData(validatingKeys, queue)),
  );

  userKeysAwaitingActivation(
    queueData: QueueData,
  ): Array<string> {
    // We return the set intersection of those keys in the
    // queue with the user's validating public keys.
    return Array.from(intersect<string>(
      queueData.userValidatingPublicKeys, queueData.activationPublicKeys
    ));
  }

  userKeysAwaitingExit(
    queueData: QueueData,
  ): Array<string> {
    // We return the set intersection of those keys in the
    // queue with the user's validating public keys.
    return Array.from(intersect<string>(
      queueData.userValidatingPublicKeys, queueData.exitPublicKeys
    ));
  }

  positionInArray(
    data: string[], pubKey: string,
  ): number {
    let idx = -1;
    for (let i = 0; i < data.length; i++) {
      if (data[i] === pubKey) {
        idx = i;
        break;
      }
    }
    // Arrays are indexed at 0, but the number will be displayed
    // as an ordinal number to the user.
    return idx + 1;
  }

  activationETAForPosition(position: number, queueData: QueueData): number {
    const epochsLeft = position / queueData.churnLimit.length;
    const secondsLeftInQueue = epochsLeft * SECONDS_PER_EPOCH;
    if (secondsLeftInQueue < SECONDS_PER_EPOCH) {
      return SECONDS_PER_EPOCH;
    }
    return secondsLeftInQueue;
  }

  transformData(validatingKeys: string[], queue: ValidatorQueue): QueueData {
    const userValidatingKeysSet = new Set<string>();
    validatingKeys.forEach(key => {
      userValidatingKeysSet.add(key);
    });

    const activationKeysSet = new Set<string>();
    const exitKeysSet = new Set<string>();

    if (queue.activation_public_keys) {
      queue.activation_public_keys.forEach((key, _) => {
        activationKeysSet.add(key);
      });
    }
    if (queue.exit_public_keys) {
      queue.exit_public_keys.forEach((key, _) => {
        exitKeysSet.add(key);
      });
    }
    let secondsLeftInQueue: number;
    if (queue.churn_limit >= activationKeysSet.size) {
      secondsLeftInQueue = 1;
    }
    const epochsLeft = activationKeysSet.size / queue.churn_limit;
    secondsLeftInQueue = epochsLeft * SECONDS_PER_EPOCH;

    //converting snake case response to camelcase
    return {
      originalData: queue,
      churnLimit: Array.from({ length: queue.churn_limit }),
      activationPublicKeys: activationKeysSet,
      exitPublicKeys: exitKeysSet,
      secondsLeftInQueue,
      userValidatingPublicKeys: userValidatingKeysSet,
    };
  }
}
