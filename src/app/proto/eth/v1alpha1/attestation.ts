/* eslint-disable */
//  Copyright 2020 Prysmatic Labs.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//

export interface Attestation {
  /**
   *  A bitfield representation of validator indices that have voted exactly
   *  the same vote and have been aggregated into this attestation.
   */
  aggregationBits: string;
  data: AttestationData | undefined;
  /**
   *  96 byte BLS aggregate signature.
   */
  signature: string;
}

export interface AggregateAttestationAndProof {
  /**
   *  The aggregator index that submitted this aggregated attestation and proof.
   */
  aggregatorIndex: number;
  /**
   *  The aggregated attestation that was submitted.
   */
  aggregate: Attestation | undefined;
  /**
   *  96 byte selection proof signed by the aggregator, which is the signature of the slot to aggregate.
   */
  selectionProof: string;
}

export interface SignedAggregateAttestationAndProof {
  /**
   *  The aggregated attestation and selection proof itself.
   */
  message: AggregateAttestationAndProof | undefined;
  /**
   *  96 byte BLS aggregate signature signed by the aggregator over the message.
   */
  signature: string;
}

/**
 *  Attestation data includes information on Casper the Friendly Finality Gadget's votes
 *  See: https://arxiv.org/pdf/1710.09437.pdf
 */
export interface AttestationData {
  /**
   *  Slot of the attestation attesting for.
   */
  slot: number;
  /**
   *  The committee index that submitted this attestation.
   */
  committeeIndex: number;
  /**
   *  32 byte root of the LMD GHOST block vote.
   */
  beaconBlockRoot: string;
  /**
   *  The most recent justified checkpoint in the beacon state
   */
  source: Checkpoint | undefined;
  /**
   *  The checkpoint attempting to be justified for the current epoch and its epoch boundary block
   */
  target: Checkpoint | undefined;
}

/**
 *  A checkpoint is every epoch's first slot. The goal of Casper FFG
 *  is to link the check points together for justification and finalization.
 */
export interface Checkpoint {
  /**
   *  Epoch the checkpoint references.
   */
  epoch: number;
  /**
   *  Block root of the checkpoint references.
   */
  root: string;
}
