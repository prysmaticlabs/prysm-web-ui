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
import { AggregateAttestationAndProof, SignedAggregateAttestationAndProof } from './attestation';

export interface DomainRequest {
  /**
   *  The epoch for which the domain is being requested.
   */
  epoch: number;
  /**
   *  The bytes domain specified by the validator.
   */
  domain: string;
}

export interface DomainResponse {
  /**
   *  The signature domain is a byte array used by validators when
   *  signing data related to block proposals and attestations.
   */
  signatureDomain: string;
}


export interface ChainStartResponse {
  /**
   *  A boolean specifying whether or not the chain has started.
   */
  started: boolean;
  /**
   *  The genesis time of the beacon chain.
   */
  genesisTime: number;
}

export interface SyncedResponse {
  /**
   *  A boolean specifying whether or not the beacon node is synced and ready for the validator.
   */
  synced: boolean;
  /**
   *  The genesis time of the beacon chain.
   */
  genesisTime: number;
}

export interface ValidatorIndexRequest {
  /**
   *  A 48 byte validator public key.
   */
  publicKey: string;
}

export interface ValidatorIndexResponse {
  /**
   *  The validator's index in the beacon chain state's validator registry.
   */
  index: number;
}

export interface ValidatorStatusRequest {
  /**
   *  A 48 byte validator public key.
   */
  publicKey: string;
}

export interface ValidatorStatusResponse {
  /**
   *  The corresponding validator status.
   */
  status: ValidatorStatus;
  /**
   *  The block number of the Ethereum proof-of-work chain
   *  where the deposit for the validator was included.
   */
  eth1DepositBlockNumber: number;
  /**
   *  The slot in the beacon chain in which the validator's
   *  deposit was included in a block.
   */
  depositInclusionSlot: number;
  /**
   *  The epoch in the beacon chain in which the validator
   *  is determined as active.
   */
  activationEpoch: number;
  /**
   *  The position in the activation queue of pending validators.
   */
  positionInActivationQueue: number;
}

export interface MultipleValidatorStatusRequest {
  /**
   *  A list of 48 byte validator public keys.
   */
  publicKeys: string[];
  /**
   *  A list of validator indices.
   */
  indices: number[];
}

export interface DutiesRequest {
  /**
   *  Epoch at which validators should perform their duties.
   */
  epoch: number;
  /**
   *  Array of byte encoded BLS public keys.
   */
  publicKeys: string[];
}

export interface DutiesResponse {
  duties: DutiesResponse_Duty[];
  currentEpochDuties: DutiesResponse_Duty[];
  nextEpochDuties: DutiesResponse_Duty[];
}

export interface DutiesResponse_Duty {
  /**
   *  The committee a validator is assigned to.
   */
  committee: number[];
  /**
   *  The index into the committee where the validator belongs in.
   */
  committeeIndex: number;
  /**
   *  Slot at which a validator must attest.
   */
  attesterSlot: number;
  /**
   *  Slots at which a validator must propose a beacon chain block.
   */
  proposerSlots: number[];
  /**
   *  48 byte BLS public key for the validator who's assigned to perform a duty.
   */
  publicKey: string;
  /**
   *  The current status of the validator assigned to perform the duty.
   */
  status: ValidatorStatus;
  /**
   *  The index of the validator in the beacon state.
   */
  validatorIndex: number;
}

export interface BlockRequest {
  /**
   *  Slot for which the block should be proposed.
   */
  slot: number;
  /**
   *  Validator's 32 byte randao reveal secret of the current epoch.
   */
  randaoReveal: string;
  /**
   *  Validator's 32 byte graffiti message for the new block.
   */
  graffiti: string;
}

export interface ProposeResponse {
  /**
   *  The block root of the successfully proposed beacon block.
   */
  blockRoot: string;
}

export interface ProposeExitResponse {
  /**
   *  The root of the successfully proposed voluntary exit.
   */
  exitRoot: string;
}

export interface AttestationDataRequest {
  /**
   *  Slot for which the attestation should be created.
   */
  slot: number;
  /**
   *  Committee index the attestation should be created for.
   */
  committeeIndex: number;
}

export interface AttestResponse {
  /**
   *  The root of the attestation data successfully submitted to the beacon node.
   */
  attestationDataRoot: string;
}

export interface AggregateSelectionRequest {
  /**
   *  Slot for which the aggregation request applies.
   */
  slot: number;
  /**
   *  Committee index of the validator at the given slot.
   */
  committeeIndex: number;
  /**
   *  48 byte public key of the validator.
   */
  publicKey: string;
  /**
   *  96 byte signature of the validator on the slot. This is used as proof that the validator is
   *  an aggregator for the given slot.
   */
  slotSignature: string;
}

export interface AggregateSelectionResponse {
  /**
   *  The aggregate and proof message without the signature.
   */
  aggregateAndProof: AggregateAttestationAndProof | undefined;
}

export interface SignedAggregateSubmitRequest {
  /**
   *  The signed aggregate and proof message with the signature.
   */
  signedAggregateAndProof: SignedAggregateAttestationAndProof | undefined;
}

export interface SignedAggregateSubmitResponse {
  /**
   *  The 32 byte hash tree root of the aggregated attestation data.
   */
  attestationDataRoot: string;
}

export interface CommitteeSubnetsSubscribeRequest {
  /**
   *  A list of intended slots to subscribe.
   */
  slots: number[];
  /**
   *  A list of intended committee ids to subscribe. It is mapped 1-to-1 with the slots
   */
  committeeIds: number[];
  /**
   *  Whether to subscribe as an aggregator or by default attester.
   *  It is mapped 1-to-1 with the slots and committee ids.
   *  Subscribe as an aggregator means to join the subnet.
   *  Subscribe as an attester means finding persistent peers on the subnet to be able to publish attestations.
   */
  isAggregator: boolean[];
}

/**
 *  An Ethereum 2.0 validator.
 */
export interface Validator {
  /**
   *  48 byte BLS public key used for the validator's activities.
   */
  public_key: string;
  /**
   *  32 byte hash of the withdrawal destination public key.
   */
  withdrawal_credentials: string;
  /**
   *  The validators current effective balance in gwei.
   */
  effective_balance: string;
  /**
   *  Whether or not the validator has been slashed.
   */
  slashed: boolean;
  /**
   *  Epoch when the validator became eligible for activation. This field may
   *  be zero if the validator was present in the Ethereum 2.0 genesis. This
   *  field is FAR_FUTURE_EPOCH if the validator has not been activated.
   */
  activation_eligibility_epoch: string;
  /**
   *  Epoch when the validator was activated. This field may be zero if the
   *  validator was present in the Ethereum 2.0 genesis. This field is
   *  FAR_FUTURE_EPOCH if the validator has not been activated.
   */
  activation_epoch: string;
  /**
   *  Epoch when the validator was exited. This field is FAR_FUTURE_EPOCH if
   *  the validator has not exited.
   *  FAR_FUTURE_EPOCH is a constant defined by the official Ethereum 2.0 specification:
   *  https://github.com/ethereum/eth2.0-specs/blob/v0.9.2/specs/core/0_beacon-chain.md#constants
   */
  exit_epoch: string;
  /**
   *  Epoch when the validator is eligible to withdraw their funds. This field
   *  is FAR_FUTURE_EPOCH if the validator has not exited.
   *  FAR_FUTURE_EPOCH is a constant defined by the official Ethereum 2.0 specification:
   *  https://github.com/ethereum/eth2.0-specs/blob/v0.9.2/specs/core/0_beacon-chain.md#constants
   */
  withdrawable_epoch: string;
}


// TODO: see if this is still needed 
/**
 *  ValidatorInfo gives information about the state of a validator at a certain epoch.
 */
export interface ValidatorInfo {
  /**
   *  The validator's 48 byte BLS public key.
   */
  publicKey: string;
  /**
   *  The validator's index in the beacon state.
   */
  index: number;
  /**
   *  The epoch for which the information pertains.
   */
  epoch: number;
  /**
   *  The validator's current status.
   */
  status: ValidatorStatus;
  /**
   *  The unix timestamp when the validator enters the next state.
   *  This could be in the past.  Some values depend on chain operation and so will vary from epoch to epoch.
   *  Specific times for each state are as follows:
   *  - state == DEPOSITED: time at which Ethereum 1 deposit will be stored on-chain by Ethereum 2 (variable, can be 0).
   *  - state == PENDING: time at which validator will be activated (variable).
   *  - state == ACTIVE: no value (next transition depends on user and network actions).
   *  - state == EXITING: time at which validator will exit.
   *  - state == SLASHING: time at which validator will exit.
   *  - state == EXITED: time at which validator funds will be withdrawable.
   */
  transitionTimestamp: number;
  /**
   *  The validator's current balance in GWei.
   */
  balance: number;
  /**
   *  The validator's current effective balance in GWei.
   *  Only valid for states ACTIVE, EXITING, SLASHING.
   */
  effectiveBalance: number;
}

// TODO: see if this is still needed 
export enum ValidatorStatus {
  UNKNOWN = 0,
  DEPOSITED = 1,
  PENDING = 2,
  ACTIVE = 3,
  EXITING = 4,
  SLASHING = 5,
  EXITED = 6,
  INVALID = 7,
  PARTIALLY_DEPOSITED = 8,
  UNRECOGNIZED = -1,
}

// TODO: see if this is still needed 
export function validatorStatusFromJSON(object: any): ValidatorStatus {
  switch (object) {
    case 0:
    case 'UNKNOWN':
      return ValidatorStatus.UNKNOWN;
    case 1:
    case 'DEPOSITED':
      return ValidatorStatus.DEPOSITED;
    case 2:
    case 'PENDING':
      return ValidatorStatus.PENDING;
    case 3:
    case 'ACTIVE':
      return ValidatorStatus.ACTIVE;
    case 4:
    case 'EXITING':
      return ValidatorStatus.EXITING;
    case 5:
    case 'SLASHING':
      return ValidatorStatus.SLASHING;
    case 6:
    case 'EXITED':
      return ValidatorStatus.EXITED;
    case 7:
    case 'INVALID':
      return ValidatorStatus.INVALID;
    case 8:
    case 'PARTIALLY_DEPOSITED':
      return ValidatorStatus.PARTIALLY_DEPOSITED;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return ValidatorStatus.UNRECOGNIZED;
  }
}
// TODO: see if this is still needed 
export function validatorStatusToJSON(object: ValidatorStatus): string {
  switch (object) {
    case ValidatorStatus.UNKNOWN:
      return 'UNKNOWN_STATUS';
    case ValidatorStatus.DEPOSITED:
      return 'DEPOSITED';
    case ValidatorStatus.PENDING:
      return 'PENDING';
    case ValidatorStatus.ACTIVE:
      return 'ACTIVE';
    case ValidatorStatus.EXITING:
      return 'EXITING';
    case ValidatorStatus.SLASHING:
      return 'SLASHING';
    case ValidatorStatus.EXITED:
      return 'EXITED';
    case ValidatorStatus.INVALID:
      return 'INVALID';
    case ValidatorStatus.PARTIALLY_DEPOSITED:
      return 'PARTIALLY_DEPOSITED';
    default:
      return 'UNKNOWN';
  }
}
