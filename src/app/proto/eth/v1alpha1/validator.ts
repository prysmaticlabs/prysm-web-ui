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
import { AggregateAttestationAndProof, SignedAggregateAttestationAndProof } from './attestation';

export interface DomainRequest {
  /**
   *  The epoch for which the domain is being requested.
   */
  epoch: number;
  /**
   *  The bytes domain specified by the validator.
   */
  domain: Uint8Array;
}

export interface DomainResponse {
  /**
   *  The signature domain is a byte array used by validators when
   *  signing data related to block proposals and attestations.
   */
  signatureDomain: Uint8Array;
}

export interface ValidatorActivationRequest {
  /**
   *  A list of 48 byte validator public keys.
   */
  publicKeys: Uint8Array[];
}

export interface ValidatorActivationResponse {
  /**
   *  A list of validator statuses mapped 1-to-1 with the public keys
   *  in the request.
   */
  statuses: ValidatorActivationResponse_Status[];
}

export interface ValidatorActivationResponse_Status {
  /**
   *  A 48 byte validator public key.
   */
  publicKey: Uint8Array;
  /**
   *  A wrapper representing a validator's status object.
   */
  status: ValidatorStatusResponse | undefined;
  /**
   *  The validators index in the beacon state.
   */
  index: number;
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
  publicKey: Uint8Array;
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
  publicKey: Uint8Array;
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
  publicKeys: Uint8Array[];
  /**
   *  A list of validator indices.
   */
  indices: number[];
}

export interface MultipleValidatorStatusResponse {
  /**
   *  A list of 48 byte validator public keys.
   */
  publicKeys: Uint8Array[];
  /**
   *  A list of ValidatorStatusResponses mapped 1-to-1 with the public keys.
   */
  statuses: ValidatorStatusResponse[];
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
  publicKeys: Uint8Array[];
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
  publicKey: Uint8Array;
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
  randaoReveal: Uint8Array;
  /**
   *  Validator's 32 byte graffiti message for the new block.
   */
  graffiti: Uint8Array;
}

export interface ProposeResponse {
  /**
   *  The block root of the successfully proposed beacon block.
   */
  blockRoot: Uint8Array;
}

export interface ProposeExitResponse {
  /**
   *  The root of the successfully proposed voluntary exit.
   */
  exitRoot: Uint8Array;
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
  attestationDataRoot: Uint8Array;
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
  publicKey: Uint8Array;
  /**
   *  96 byte signature of the validator on the slot. This is used as proof that the validator is
   *  an aggregator for the given slot.
   */
  slotSignature: Uint8Array;
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
  attestationDataRoot: Uint8Array;
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
  publicKey: Uint8Array;
  /**
   *  32 byte hash of the withdrawal destination public key.
   */
  withdrawalCredentials: Uint8Array;
  /**
   *  The validators current effective balance in gwei.
   */
  effectiveBalance: number;
  /**
   *  Whether or not the validator has been slashed.
   */
  slashed: boolean;
  /**
   *  Epoch when the validator became eligible for activation. This field may
   *  be zero if the validator was present in the Ethereum 2.0 genesis. This
   *  field is FAR_FUTURE_EPOCH if the validator has not been activated.
   */
  activationEligibilityEpoch: number;
  /**
   *  Epoch when the validator was activated. This field may be zero if the
   *  validator was present in the Ethereum 2.0 genesis. This field is
   *  FAR_FUTURE_EPOCH if the validator has not been activated.
   */
  activationEpoch: number;
  /**
   *  Epoch when the validator was exited. This field is FAR_FUTURE_EPOCH if
   *  the validator has not exited.
   *  FAR_FUTURE_EPOCH is a constant defined by the official Ethereum 2.0 specification:
   *  https://github.com/ethereum/eth2.0-specs/blob/v0.9.2/specs/core/0_beacon-chain.md#constants
   */
  exitEpoch: number;
  /**
   *  Epoch when the validator is eligible to withdraw their funds. This field
   *  is FAR_FUTURE_EPOCH if the validator has not exited.
   *  FAR_FUTURE_EPOCH is a constant defined by the official Ethereum 2.0 specification:
   *  https://github.com/ethereum/eth2.0-specs/blob/v0.9.2/specs/core/0_beacon-chain.md#constants
   */
  withdrawableEpoch: number;
}

/**
 *  ValidatorParticipation stores participation metrics during a given epoch.
 */
export interface ValidatorParticipation {
  /**
   *  Percentage of validator participation in the given epoch. This field
   *  contains a value between 0 and 1.
   */
  globalParticipationRate: number;
  /**
   *  The total amount of ether, in gwei, that has been used in voting.
   */
  votedEther: number;
  /**
   *  The total amount of ether, in gwei, that is eligible for voting.
   */
  eligibleEther: number;
  /**
   *  Total staked gwei that was active (i.e. eligible to vote) during the current epoch.
   */
  currentEpochActiveGwei: number;
  /**
   *  Total staked gwei that had attestations included in a block during the current epoch,
   *  attestations by the same validator do not increase this figure.
   */
  currentEpochAttestingGwei: number;
  /**
   *  Total staked gwei that attested to the majority-elected Casper FFG target epoch during the current epoch.
   */
  currentEpochTargetAttestingGwei: number;
  /**
   *  Same as current_epoch_active_gwei but for previous epoch.
   */
  previousEpochActiveGwei: number;
  /**
   *  Same as current_epoch_attesting_gwei but for previous epoch.
   */
  previousEpochAttestingGwei: number;
  /**
   *  Same as current_epoch_target_attesting_gwei but for previous epoch.
   */
  previousEpochTargetAttestingGwei: number;
  /**
   *  Total staked gwei that attested to a head beacon block that is in the canonical chain.
   */
  previousEpochHeadAttestingGwei: number;
}

/**
 *  ValidatorInfo gives information about the state of a validator at a certain epoch.
 */
export interface ValidatorInfo {
  /**
   *  The validator's 48 byte BLS public key.
   */
  publicKey: Uint8Array;
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

const baseDomainRequest: object = {
  epoch: 0,
};

const baseDomainResponse: object = {
};

const baseValidatorActivationRequest: object = {
};

const baseValidatorActivationResponse: object = {
};

const baseValidatorActivationResponse_Status: object = {
  index: 0,
};

const baseChainStartResponse: object = {
  started: false,
  genesisTime: 0,
};

const baseSyncedResponse: object = {
  synced: false,
  genesisTime: 0,
};

const baseValidatorIndexRequest: object = {
};

const baseValidatorIndexResponse: object = {
  index: 0,
};

const baseValidatorStatusRequest: object = {
};

const baseValidatorStatusResponse: object = {
  status: 0,
  eth1DepositBlockNumber: 0,
  depositInclusionSlot: 0,
  activationEpoch: 0,
  positionInActivationQueue: 0,
};

const baseMultipleValidatorStatusRequest: object = {
  indices: 0,
};

const baseMultipleValidatorStatusResponse: object = {
  indices: 0,
};

const baseDutiesRequest: object = {
  epoch: 0,
};

const baseDutiesResponse: object = {
};

const baseDutiesResponse_Duty: object = {
  committee: 0,
  committeeIndex: 0,
  attesterSlot: 0,
  proposerSlots: 0,
  status: 0,
  validatorIndex: 0,
};

const baseBlockRequest: object = {
  slot: 0,
};

const baseProposeResponse: object = {
};

const baseProposeExitResponse: object = {
};

const baseAttestationDataRequest: object = {
  slot: 0,
  committeeIndex: 0,
};

const baseAttestResponse: object = {
};

const baseAggregateSelectionRequest: object = {
  slot: 0,
  committeeIndex: 0,
};

const baseAggregateSelectionResponse: object = {
};

const baseSignedAggregateSubmitRequest: object = {
};

const baseSignedAggregateSubmitResponse: object = {
};

const baseCommitteeSubnetsSubscribeRequest: object = {
  slots: 0,
  committeeIds: 0,
  isAggregator: false,
};

const baseValidator: object = {
  effectiveBalance: 0,
  slashed: false,
  activationEligibilityEpoch: 0,
  activationEpoch: 0,
  exitEpoch: 0,
  withdrawableEpoch: 0,
};

const baseValidatorParticipation: object = {
  globalParticipationRate: 0,
  votedEther: 0,
  eligibleEther: 0,
  currentEpochActiveGwei: 0,
  currentEpochAttestingGwei: 0,
  currentEpochTargetAttestingGwei: 0,
  previousEpochActiveGwei: 0,
  previousEpochAttestingGwei: 0,
  previousEpochTargetAttestingGwei: 0,
  previousEpochHeadAttestingGwei: 0,
};

const baseValidatorInfo: object = {
  index: 0,
  epoch: 0,
  status: 0,
  transitionTimestamp: 0,
  balance: 0,
  effectiveBalance: 0,
};

export enum ValidatorStatus {
  UNKNOWN_STATUS = 0,
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

export function validatorStatusFromJSON(object: any): ValidatorStatus {
  switch (object) {
    case 0:
    case "UNKNOWN_STATUS":
      return ValidatorStatus.UNKNOWN_STATUS;
    case 1:
    case "DEPOSITED":
      return ValidatorStatus.DEPOSITED;
    case 2:
    case "PENDING":
      return ValidatorStatus.PENDING;
    case 3:
    case "ACTIVE":
      return ValidatorStatus.ACTIVE;
    case 4:
    case "EXITING":
      return ValidatorStatus.EXITING;
    case 5:
    case "SLASHING":
      return ValidatorStatus.SLASHING;
    case 6:
    case "EXITED":
      return ValidatorStatus.EXITED;
    case 7:
    case "INVALID":
      return ValidatorStatus.INVALID;
    case 8:
    case "PARTIALLY_DEPOSITED":
      return ValidatorStatus.PARTIALLY_DEPOSITED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ValidatorStatus.UNRECOGNIZED;
  }
}

export function validatorStatusToJSON(object: ValidatorStatus): string {
  switch (object) {
    case ValidatorStatus.UNKNOWN_STATUS:
      return "UNKNOWN_STATUS";
    case ValidatorStatus.DEPOSITED:
      return "DEPOSITED";
    case ValidatorStatus.PENDING:
      return "PENDING";
    case ValidatorStatus.ACTIVE:
      return "ACTIVE";
    case ValidatorStatus.EXITING:
      return "EXITING";
    case ValidatorStatus.SLASHING:
      return "SLASHING";
    case ValidatorStatus.EXITED:
      return "EXITED";
    case ValidatorStatus.INVALID:
      return "INVALID";
    case ValidatorStatus.PARTIALLY_DEPOSITED:
      return "PARTIALLY_DEPOSITED";
    default:
      return "UNKNOWN";
  }
}
