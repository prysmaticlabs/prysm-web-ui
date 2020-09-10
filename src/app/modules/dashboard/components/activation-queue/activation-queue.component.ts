import { Component } from '@angular/core';

import { map } from 'rxjs/operators';
import { zip } from 'rxjs';
import { hexlify } from 'ethers/lib/utils';
import intersect from 'src/app/modules/core/utils/intersect';
import fromHexString from 'src/app/modules/core/utils/from-hex-string';

import { ValidatorService } from 'src/app/modules/core/services/validator.service';
import { ValidatorQueue } from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { SECONDS_PER_EPOCH } from 'src/app/modules/core/constants';

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
    data: Uint8Array[], pubKey: string,
  ): number {
    const key = fromHexString(pubKey);
    let idx = -1;
    for (let i = 0; i < data.length; i++) {
      if (data[i].toString() === key.toString()) {
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

  transformData(validatingKeys: Uint8Array[], queue: ValidatorQueue): QueueData {
    const userValidatingKeysSet = new Set<string>();
    validatingKeys.forEach(key => {
      userValidatingKeysSet.add(hexlify(key));
    });

    const activationKeysSet = new Set<string>();
    const exitKeysSet = new Set<string>();

    queue.activationPublicKeys.forEach((key, idx) => {
      activationKeysSet.add(hexlify(key));
    });
    queue.exitPublicKeys.forEach((key, idx) => {
      exitKeysSet.add(hexlify(key));
    });
    let secondsLeftInQueue: number;
    const queueLength = 11323;
    if (queue.churnLimit >= queueLength) {
      secondsLeftInQueue = 1;
    }
    const epochsLeft = queueLength / queue.churnLimit;
    secondsLeftInQueue = epochsLeft * SECONDS_PER_EPOCH;

    return {
      originalData: queue,
      churnLimit: Array.from({ length: queue.churnLimit }),
      activationPublicKeys: activationKeysSet,
      exitPublicKeys: exitKeysSet,
      secondsLeftInQueue,
      userValidatingPublicKeys: userValidatingKeysSet,
    };
  }
}
