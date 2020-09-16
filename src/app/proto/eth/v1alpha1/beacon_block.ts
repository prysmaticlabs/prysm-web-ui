/* eslint-disable */
//  Copyright 2020 Prysmatic Labs.
//
//  Licensed under the Apache License, Version 2.0 (the 'License');
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an 'AS IS' BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//
import { Attestation, AttestationData } from './attestation';

/**
 *  The Ethereum 2.0 beacon block. The message does not contain a validator signature.
 */
export interface BeaconBlock {
  /**
   *  Beacon chain slot that this block represents.
   */
  slot: number;
  /**
   *  Validator index of the validator that proposed the block header.
   */
  proposerIndex: number;
  /**
   *  32 byte root of the parent block.
   */
  parentRoot: string;
  /**
   *  32 byte root of the resulting state after processing this block.
   */
  stateRoot: string;
  /**
   *  The block body itself.
   */
  body: BeaconBlockBody | undefined;
}

/**
 *  The signed version of beacon block.
 */
export interface SignedBeaconBlock {
  /**
   *  The unsigned beacon block itself.
   */
  block: BeaconBlock | undefined;
  /**
   *  96 byte BLS signature from the validator that produced this block.
   */
  signature: string;
}

/**
 *  The block body of an Ethereum 2.0 beacon block.
 */
export interface BeaconBlockBody {
  /**
   *  The validators RANDAO reveal 96 byte value.
   */
  randaoReveal: string;
  /**
   *  A reference to the Ethereum 1.x chain.
   */
  eth1Data: Eth1Data | undefined;
  /**
   *  32 byte field of arbitrary data. This field may contain any data and
   *  is not used for anything other than a fun message.
   */
  graffiti: string;
  /**
   *  At most MAX_PROPOSER_SLASHINGS.
   */
  proposerSlashings: ProposerSlashing[];
  /**
   *  At most MAX_ATTESTER_SLASHINGS.
   */
  attesterSlashings: AttesterSlashing[];
  /**
   *  At most MAX_ATTESTATIONS.
   */
  attestations: Attestation[];
  /**
   *  At most MAX_DEPOSITS.
   */
  deposits: Deposit[];
  /**
   *  At most MAX_VOLUNTARY_EXITS.
   */
  voluntaryExits: SignedVoluntaryExit[];
}

/**
 *  Proposer slashings are proofs that a slashable offense has been committed by
 *  proposing two conflicting blocks from the same validator.
 */
export interface ProposerSlashing {
  /**
   *  First conflicting signed block header.
   */
  header1: SignedBeaconBlockHeader | undefined;
  /**
   *  Second conflicting signed block header.
   */
  header2: SignedBeaconBlockHeader | undefined;
}

/**
 *  Attestor slashings are proofs that a slashable offense has been committed by
 *  attestating to two conflicting pieces of information by the same validator.
 */
export interface AttesterSlashing {
  /**
   *  First conflicting attestation.
   */
  attestation1: IndexedAttestation | undefined;
  /**
   *  Second conflicting attestation.
   */
  attestation2: IndexedAttestation | undefined;
}

/**
 *  Deposit into the Ethereum 2.0 from the Ethereum 1.x deposit contract.
 */
export interface Deposit {
  /**
   *  32 byte roots in the deposit tree branch.
   */
  proof: string[];
  data: Deposit_Data | undefined;
}

export interface Deposit_Data {
  /**
   *  48 byte BLS public key of the validator.
   */
  publicKey: string;
  /**
   *  A 32 byte hash of the withdrawal address public key.
   */
  withdrawalCredentials: string;
  /**
   *  Deposit amount in gwei.
   */
  amount: number;
  /**
   *  96 byte signature from the validators public key.
   */
  signature: string;
}

/**
 *  A message that represents a validator signaling that they want to voluntarily
 *  withdraw from the active validator set. The message does not contain a
 *  validator signature.
 */
export interface VoluntaryExit {
  /**
   *  The epoch on when exit request becomes valid.
   */
  epoch: number;
  /**
   *  Index of the exiting validator.
   */
  validatorIndex: number;
}

/**
 *  The signed version of voluntary exit.
 */
export interface SignedVoluntaryExit {
  /**
   *  The unsigned voluntary exit itself.
   */
  exit: VoluntaryExit | undefined;
  /**
   *  Validator's 96 byte signature
   */
  signature: string;
}

/**
 *  Eth1Data represents references to the Ethereum 1.x deposit contract.
 */
export interface Eth1Data {
  /**
   *  The 32 byte deposit tree root for the last deposit included in this
   *  block.
   */
  depositRoot: string;
  /**
   *  The total number of deposits included in the beacon chain since genesis
   *  including the deposits in this block.
   */
  depositCount: number;
  /**
   *  The 32 byte block hash of the Ethereum 1.x block considered for deposit
   *  inclusion.
   */
  blockHash: string;
}

/**
 *  A beacon block header is essentially a beacon block with only a reference to
 *  the beacon body as a 32 byte merkle tree root. This type of message is more
 *  lightweight than a full beacon block. The message does not contain
 *  a validator signature.
 */
export interface BeaconBlockHeader {
  /**
   *  Beacon chain slot that this block represents.
   */
  slot: number;
  /**
   *  Validator index of the validator that proposed the block header.
   */
  proposerIndex: number;
  /**
   *  32 byte merkle tree root of the parent ssz encoded block.
   */
  parentRoot: string;
  /**
   *  32 byte merkle tree root of the resulting ssz encoded state after processing this block.
   */
  stateRoot: string;
  /**
   *  32 byte merkle tree root of the ssz encoded block body.
   */
  bodyRoot: string;
}

export interface SignedBeaconBlockHeader {
  /**
   *  The unsigned beacon block header itself.
   */
  header: BeaconBlockHeader | undefined;
  /**
   *  96 byte BLS signature from the validator that produced this block header.
   */
  signature: string;
}

export interface IndexedAttestation {
  attestingIndices: number[];
  data: AttestationData | undefined;
  /**
   *  96 bytes aggregate signature.
   */
  signature: string;
}
