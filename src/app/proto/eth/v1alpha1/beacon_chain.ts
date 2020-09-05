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
import { Attestation } from './attestation';
import { IndexedAttestation, SignedBeaconBlock } from './beacon_block';
import { Validator, ValidatorParticipation } from './validator';

/**
 *  ValidatorChangeSet updates the server's list of keys on which to operate.
 */
export interface ValidatorChangeSet {
  /**
   *  Action (add/remove/set).
   */
  action: SetAction;
  /**
   *  48 byte BLS public keys of validators on which the operation occurs.
   */
  publicKeys: Uint8Array[];
}

/**
 *  Request for indexed attestations by target epoch.
 */
export interface ListIndexedAttestationsRequest {
  /**
   *  Retrieve attestations by epoch processed.
   */
  epoch: number | undefined;
  /**
   *  Optional criteria to retrieve genesis epoch attestations.
   */
  genesisEpoch: boolean | undefined;
  /**
   *  The maximum number of IndexedAttestations to return in the response.
   *  This field is optional.
   */
  pageSize: number;
  /**
   *  A pagination token returned from a previous call to `ListIndexedAttestations`
   *  that indicates where this listing should continue from.
   *  This field is optional.
   */
  pageToken: string;
}

/**
 *  Request for attestations.
 */
export interface ListAttestationsRequest {
  /**
   *  Filter attestations by epoch processed.
   */
  epoch: number | undefined;
  /**
   *  Optional criteria to retrieve attestations from 0 epoch.
   */
  genesisEpoch: boolean | undefined;
  /**
   *  The maximum number of Attestations to return in the response.
   *  This field is optional.
   */
  pageSize: number;
  /**
   *  A pagination token returned from a previous call to `ListAttestations`
   *  that indicates where this listing should continue from.
   *  This field is optional.
   */
  pageToken: string;
}

export interface ListAttestationsResponse {
  attestations: Attestation[];
  /**
   *  A pagination token returned from a previous call to `ListAttestations`
   *  that indicates from where listing should continue.
   *  This field is optional.
   */
  nextPageToken: string;
  /**
   *  Total count of Attestations matching the request filter.
   */
  totalSize: number;
}

export interface ListIndexedAttestationsResponse {
  indexedAttestations: IndexedAttestation[];
  /**
   *  A pagination token returned from a previous call to `ListIndexedAttestations`
   *  that indicates from where listing should continue.
   *  This field is optional.
   */
  nextPageToken: string;
  /**
   *  Total count of Attestations matching the request filter.
   */
  totalSize: number;
}

export interface ListBlocksRequest {
  /**
   *  Block root filter to return a single block.
   */
  root: Uint8Array | undefined;
  /**
   *  Slot to lookup a block. If the slot is not yet finalized, this
   *  criteria may yield multiple valid blocks if the node has seen blocks
   *  from another fork.
   */
  slot: number | undefined;
  /**
   *  The epoch number for which to retrieve blocks. If specified, this
   *  will return all blocks found within the span of the specified epoch.
   */
  epoch: number | undefined;
  /**
   *  Optional criteria to retrieve genesis block.
   */
  genesis: boolean | undefined;
  /**
   *  The maximum number of Blocks to return in the response.
   *  This field is optional.
   */
  pageSize: number;
  /**
   *  A pagination token returned from a previous call to `ListBlocks`
   *  that indicates where this listing should continue from.
   *  This field is optional.
   */
  pageToken: string;
}

export interface ListBlocksResponse {
  blockContainers: BeaconBlockContainer[];
  /**
   *  A pagination token returned from a previous call to `ListBlocks`
   *  that indicates from where listing should continue.
   *  This field is optional.
   */
  nextPageToken: string;
  /**
   *  Total count of Blocks matching the request filter.
   */
  totalSize: number;
}

/**
 *  A container that contains both the beacon block
 *  and its corresponding root.
 */
export interface BeaconBlockContainer {
  /**
   *  The contained Ethereum beacon block.
   */
  block: SignedBeaconBlock | undefined;
  /**
   *  32 byte merkle tree root of contained beacon block.
   */
  blockRoot: Uint8Array;
}

/**
 *  Information about the head of the beacon chain.
 */
export interface ChainHead {
  /**
   *  Slot of the head block.
   */
  headSlot: number;
  /**
   *  Epoch of the head block.
   */
  headEpoch: number;
  /**
   *  32 byte merkle tree root of the canonical head block in the beacon node.
   */
  headBlockRoot: Uint8Array;
  /**
   *  Most recent slot that contains the finalized block.
   */
  finalizedSlot: number;
  /**
   *  Epoch of the finalized block.
   */
  finalizedEpoch: number;
  /**
   *  Most recent 32 byte finalized block root.
   */
  finalizedBlockRoot: Uint8Array;
  /**
   *  Most recent slot that contains the justified block.
   */
  justifiedSlot: number;
  /**
   *  Epoch of the justified block.
   */
  justifiedEpoch: number;
  /**
   *  Most recent 32 byte justified block root.
   */
  justifiedBlockRoot: Uint8Array;
  /**
   *  Most recent slot that contains the previous justified block.
   */
  previousJustifiedSlot: number;
  /**
   *  Epoch of the previous justified block.
   */
  previousJustifiedEpoch: number;
  /**
   *  Previous 32 byte justified block root.
   */
  previousJustifiedBlockRoot: Uint8Array;
}

export interface ListCommitteesRequest {
  /**
   *  Optional criteria to retrieve data at a specific epoch.
   */
  epoch: number | undefined;
  /**
   *  Optional criteria to retrieve genesis data.
   */
  genesis: boolean | undefined;
}

export interface BeaconCommittees {
  /**
   *  The epoch for which the committees in the response belong to.
   */
  epoch: number;
  /**
   *  A map of validator committees by slot.
   */
  committees: { [key: number]: BeaconCommittees_CommitteesList };
  /**
   *  The number of active validators at the given epoch.
   */
  activeValidatorCount: number;
}

export interface BeaconCommittees_CommitteeItem {
  /**
   *  A committee is a list of validator indices participating in consensus at a slot.
   */
  validatorIndices: number[];
}

export interface BeaconCommittees_CommitteesList {
  /**
   *  A list of committees.
   */
  committees: BeaconCommittees_CommitteeItem[];
}

export interface BeaconCommittees_CommitteesEntry {
  key: number;
  value: BeaconCommittees_CommitteesList | undefined;
}

export interface ListValidatorBalancesRequest {
  /**
   *  Optional criteria to retrieve balances at a specific epoch.
   */
  epoch: number | undefined;
  /**
   *  Optional criteria to retrieve the genesis list of balances.
   */
  genesis: boolean | undefined;
  /**
   *  Validator 48 byte BLS public keys to filter validators for the given
   *  epoch.
   */
  publicKeys: Uint8Array[];
  /**
   *  Validator indices to filter validators for the given epoch.
   */
  indices: number[];
  /**
   *  The maximum number of Validators to return in the response.
   *  This field is optional.
   */
  pageSize: number;
  /**
   *  A pagination token returned from a previous call to `GetValidators`
   *  that indicates where this listing should continue from.
   *  This field is optional.
   */
  pageToken: string;
}

export interface ValidatorBalances {
  /**
   *  Epoch which the state was considered to determine the validator balances.
   */
  epoch: number;
  balances: ValidatorBalances_Balance[];
  /**
   *  A pagination token returned from a previous call to `GetListValidatorBalances`
   *  that indicates from where listing should continue.
   */
  nextPageToken: string;
  /**
   *  Total count of items matching the request filter.
   */
  totalSize: number;
}

export interface ValidatorBalances_Balance {
  /**
   *  Validator's 48 byte BLS public key.
   */
  publicKey: Uint8Array;
  /**
   *  Validator's index in the validator set.
   */
  index: number;
  /**
   *  Validator's balance in gwei.
   */
  balance: number;
}

export interface ListValidatorsRequest {
  /**
   *  Optional criteria to retrieve validators at a specific epoch.
   *  Omitting this field or setting it to zero will retrieve a response
   *  with the current active validator set.
   */
  epoch: number | undefined;
  /**
   *  Optional criteria to retrieve the genesis set of validators.
   */
  genesis: boolean | undefined;
  /**
   *  Specify whether or not you want to retrieve only active validators.
   */
  active: boolean;
  /**
   *  The maximum number of Validators to return in the response.
   *  This field is optional.
   */
  pageSize: number;
  /**
   *  A pagination token returned from a previous call to `GetValidators`
   *  that indicates where this listing should continue from.
   *  This field is optional.
   */
  pageToken: string;
  /**
   *  Specify which validators you would like to retrieve by their public keys.
   *  This field is optional.
   */
  publicKeys: Uint8Array[];
  /**
   *  Specify which validators you would like to retrieve by their indices.
   *  This field is optional.
   */
  indices: number[];
}

export interface GetValidatorRequest {
  /**
   *  Validator index in the registry.
   */
  index: number | undefined;
  /**
   *  48 byte validator public key.
   */
  publicKey: Uint8Array | undefined;
}

export interface Validators {
  /**
   *  Epoch which the state was considered to determine the active validator
   *  set. This field is not optional. Zero value epoch indicates the validator
   *  set is from the Ethereum 2.0 genesis set.
   */
  epoch: number;
  validatorList: Validators_ValidatorContainer[];
  /**
   *  A pagination token returned from a previous call to `GetValidators`
   *  that indicates from where listing should continue.
   *  This field is optional.
   */
  nextPageToken: string;
  /**
   *  Total count of Validators matching the request filter.
   */
  totalSize: number;
}

export interface Validators_ValidatorContainer {
  index: number;
  validator: Validator | undefined;
}

export interface GetValidatorActiveSetChangesRequest {
  /**
   *  Optional criteria to retrieve balances at a specific epoch.
   */
  epoch: number | undefined;
  /**
   *  Optional criteria to retrieve the genesis list of balances.
   */
  genesis: boolean | undefined;
}

export interface ActiveSetChanges {
  /**
   *  Epoch which the state was considered to determine the active validator
   *  set.
   */
  epoch: number;
  /**
   *  48 byte validator public keys that have been activated in the given epoch.
   */
  activatedPublicKeys: Uint8Array[];
  /**
   *  Indices of validators activated in the given epoch.
   */
  activatedIndices: number[];
  /**
   *  48 byte validator public keys that have been voluntarily exited in the given epoch.
   */
  exitedPublicKeys: Uint8Array[];
  /**
   *  Indices of validators exited in the given epoch.
   */
  exitedIndices: number[];
  /**
   *  48 byte validator public keys that have been slashed in the given epoch.
   */
  slashedPublicKeys: Uint8Array[];
  /**
   *  Indices of validators slashed in the given epoch.
   */
  slashedIndices: number[];
  /**
   *  48 byte validator public keys that have been involuntarily ejected in this epoch.
   */
  ejectedPublicKeys: Uint8Array[];
  /**
   *  Indices of validators ejected in the given epoch.
   */
  ejectedIndices: number[];
}

export interface ValidatorPerformanceRequest {
  /**
   *  A list of 48 byte validator public keys.
   */
  publicKeys: Uint8Array[];
  /**
   *  A list of validator indices to retrieve performance by their indices.
   */
  indices: number[];
}

export interface ValidatorPerformanceResponse {
  /**
   *  A list of validator effective balances mapped 1-to-1 with the request's
   *  public keys.
   */
  currentEffectiveBalances: number[];
  /**
   *  The slot of when validator's attestation got included in the chain at previous epoch, the slot
   *  is mapped 1-to-1 with the request's public keys.
   */
  inclusionSlots: number[];
  /**
   *  The distance of when validator submitted and got included in the chain, the distance
   *  is mapped 1-to-1 with the request's public keys.
   */
  inclusionDistances: number[];
  /**
   *  Whether the list of validator recently correctly voted for source at previous epoch, the result
   *  is mapped 1-to-1 with the request's public keys.
   */
  correctlyVotedSource: boolean[];
  /**
   *  Whether the list of validator recently correctly voted for target at previous epoch, the result
   *  is mapped 1-to-1 with the request's public keys.
   */
  correctlyVotedTarget: boolean[];
  /**
   *  Whether the list of validator recently correctly voted for head at previous epoch, the result
   *  is mapped 1-to-1 with the request's public keys.
   */
  correctlyVotedHead: boolean[];
  /**
   *  The balance of validators before epoch transition, the balance is mapped 1-to-1 with the requests's
   *  public keys.
   */
  balancesBeforeEpochTransition: number[];
  /**
   *  The balance of validators after epoch transition, the balance is mapped 1-to-1 with the requests's
   *  public keys.
   */
  balancesAfterEpochTransition: number[];
  /**
   *  The total number of validators from the request not found in
   *  in the beacon chain.
   */
  missingValidators: Uint8Array[];
  /**
   *  The average active validator balance in the beacon chain.
   */
  averageActiveValidatorBalance: number;
  /**
   *  The public keys in the order they are in of the response.
   */
  publicKeys: Uint8Array[];
}

export interface ValidatorQueue {
  /**
   *  The amount of ether in gwei allowed to enter or exit the active
   *  validator set.
   */
  churnLimit: number;
  /**
   *  Ordered list of 48 byte public keys awaiting activation. 0th index is the
   *  next key to be processed.
   */
  activationPublicKeys: Uint8Array[];
  /**
   *  Ordered list of public keys awaiting exit. 0th index is the next key to
   *  be processed.
   */
  exitPublicKeys: Uint8Array[];
  /**
   *  Ordered list of validator indices awaiting activation. 0th item in the list is the
   *  next validator index to be processed.
   */
  activationValidatorIndices: number[];
  /**
   *  Ordered list of validator indices awaiting exit. 0th item in the list is the
   *  next validator index to be processed.
   */
  exitValidatorIndices: number[];
}

export interface ListValidatorAssignmentsRequest {
  /**
   *  Epoch to validator assignments for.
   */
  epoch: number | undefined;
  /**
   *  Whether or not to query for the genesis information.
   */
  genesis: boolean | undefined;
  /**
   *  48 byte validator public keys to filter assignments for the given epoch.
   */
  publicKeys: Uint8Array[];
  /**
   *  Validator indicies to filter assignments for the given epoch.
   */
  indices: number[];
  /**
   *  The maximum number of ValidatorAssignments to return in the response.
   *  This field is optional.
   */
  pageSize: number;
  /**
   *  A pagination token returned from a previous call to `ListValidatorAssignments`
   *  that indicates where this listing should continue from.
   *  This field is optional.
   */
  pageToken: string;
}

export interface ValidatorAssignments {
  /**
   *  The epoch for which this set of validator assignments is valid.
   */
  epoch: number;
  assignments: ValidatorAssignments_CommitteeAssignment[];
  /**
   *  A pagination token returned from a previous call to `ListValidatorAssignmentsRequest`
   *  that indicates where this listing should continue from.
   *  This field is optional.
   */
  nextPageToken: string;
  /**
   *  Total count of CommitteeAssignments matching the request filter.
   */
  totalSize: number;
}

export interface ValidatorAssignments_CommitteeAssignment {
  /**
   *  Beacon committees are responsible for crosslinking committee data back to the beacon chain,
   *  they also attest and produce beacon chain blocks. This is a list of validator indices that
   *  are in the same committee as requested validator, everyone in the committee is assigned to the
   *  same slot and same committee.
   */
  beaconCommittees: number[];
  /**
   *  Committee index represents the committee of validator that's in.
   */
  committeeIndex: number;
  /**
   *  Beacon chain slot in which the validator must perform its assigned
   *  duty as an attester.
   */
  attesterSlot: number;
  /**
   *  Beacon chain slots in which the validator must perform its assigned
   *  duty as a proposer.
   */
  proposerSlots: number[];
  /**
   *  48 byte BLS public key.
   */
  publicKey: Uint8Array;
  /**
   *  Validator index in the beacon state.
   */
  validatorIndex: number;
}

export interface GetValidatorParticipationRequest {
  /**
   *  Epoch to request participation information.
   */
  epoch: number | undefined;
  /**
   *  Whether or not to query for the genesis information.
   */
  genesis: boolean | undefined;
}

export interface ValidatorParticipationResponse {
  /**
   *  Epoch which this message is applicable.
   */
  epoch: number;
  /**
   *  Whether or not epoch has been finalized.
   */
  finalized: boolean;
  /**
   *  The actual validator participation metrics.
   */
  participation: ValidatorParticipation | undefined;
}

export interface AttestationPoolRequest {
  /**
   *  The maximum number of objects to return in the response.
   *  This field is optional.
   */
  pageSize: number;
  /**
   *  A pagination token returned from a previous call
   *  that indicates where this listing should continue from.
   *  This field is optional.
   */
  pageToken: string;
}

export interface AttestationPoolResponse {
  /**
   *  List of attestations currently in the pool of the beacon chain.
   */
  attestations: Attestation[];
  /**
   *  A pagination token returned from a previous call
   *  that indicates where this listing should continue from.
   *  This field is optional.
   */
  nextPageToken: string;
  /**
   *  Total count of objects matching the request filter.
   */
  totalSize: number;
}

/**
 *  Information about the configuration parameters of the beacon node, such
 *  as the slots per epoch, slots per eth1 voting period, and more.
 */
export interface BeaconConfig {
  config: { [key: string]: string };
}

export interface BeaconConfig_ConfigEntry {
  key: string;
  value: string;
}

export interface SubmitSlashingResponse {
  /**
   *  Indices of the validators to be slashed by the submitted
   *  proposer/attester slashing object.
   */
  slashedIndices: number[];
}

export interface IndividualVotesRequest {
  /**
   *  Epoch of the request.
   */
  epoch: number;
  /**
   *  Validator 48 byte BLS public keys to filter validators for the given epoch.
   */
  publicKeys: Uint8Array[];
  /**
   *  Validator indices to filter validators for the given epoch.
   */
  indices: number[];
}

export interface IndividualVotesRespond {
  individualVotes: IndividualVotesRespond_IndividualVote[];
}

export interface IndividualVotesRespond_IndividualVote {
  /**
   *  The epoch of the vote status request.
   */
  epoch: number;
  /**
   *  The public key of the vote status request.
   */
  publicKey: Uint8Array;
  /**
   *  The validator index of the request.
   */
  validatorIndex: number;
  /**
   *  Has the validator been slashed.
   */
  isSlashed: boolean;
  /**
   *  Is the validator withdrawable.
   */
  isWithdrawableInCurrentEpoch: boolean;
  /**
   *  Is the validator active in current epoch.
   */
  isActiveInCurrentEpoch: boolean;
  /**
   *  Was the validator active in previous epoch.
   */
  isActiveInPreviousEpoch: boolean;
  /**
   *  Did validator attest for current epoch.
   */
  isCurrentEpochAttester: boolean;
  /**
   *  Did validator attest target for current epoch.
   */
  isCurrentEpochTargetAttester: boolean;
  /**
   *  Did validator attest for previous epoch.
   */
  isPreviousEpochAttester: boolean;
  /**
   *  Did validator attest target for previous epoch.
   */
  isPreviousEpochTargetAttester: boolean;
  /**
   *  Did validator attest head for previous epoch.
   */
  isPreviousEpochHeadAttester: boolean;
  /**
   *  The current effective balance of the validator.
   */
  currentEpochEffectiveBalanceGwei: number;
  /**
   *  The slots of when the validator's attestation got included in the block.
   */
  inclusionSlot: number;
  /**
   *  How many slots have passed until the validator's attestation got included in the block.
   */
  inclusionDistance: number;
}

const baseValidatorChangeSet: object = {
  action: 0,
};

const baseListIndexedAttestationsRequest: object = {
  pageSize: 0,
  pageToken: "",
};

const baseListAttestationsRequest: object = {
  pageSize: 0,
  pageToken: "",
};

const baseListAttestationsResponse: object = {
  nextPageToken: "",
  totalSize: 0,
};

const baseListIndexedAttestationsResponse: object = {
  nextPageToken: "",
  totalSize: 0,
};

const baseListBlocksRequest: object = {
  pageSize: 0,
  pageToken: "",
};

const baseListBlocksResponse: object = {
  nextPageToken: "",
  totalSize: 0,
};

const baseBeaconBlockContainer: object = {
};

const baseChainHead: object = {
  headSlot: 0,
  headEpoch: 0,
  finalizedSlot: 0,
  finalizedEpoch: 0,
  justifiedSlot: 0,
  justifiedEpoch: 0,
  previousJustifiedSlot: 0,
  previousJustifiedEpoch: 0,
};

const baseListCommitteesRequest: object = {
};

const baseBeaconCommittees: object = {
  epoch: 0,
  activeValidatorCount: 0,
};

const baseBeaconCommittees_CommitteeItem: object = {
  validatorIndices: 0,
};

const baseBeaconCommittees_CommitteesList: object = {
};

const baseBeaconCommittees_CommitteesEntry: object = {
  key: 0,
};

const baseListValidatorBalancesRequest: object = {
  indices: 0,
  pageSize: 0,
  pageToken: "",
};

const baseValidatorBalances: object = {
  epoch: 0,
  nextPageToken: "",
  totalSize: 0,
};

const baseValidatorBalances_Balance: object = {
  index: 0,
  balance: 0,
};

const baseListValidatorsRequest: object = {
  active: false,
  pageSize: 0,
  pageToken: "",
  indices: 0,
};

const baseGetValidatorRequest: object = {
};

const baseValidators: object = {
  epoch: 0,
  nextPageToken: "",
  totalSize: 0,
};

const baseValidators_ValidatorContainer: object = {
  index: 0,
};

const baseGetValidatorActiveSetChangesRequest: object = {
};

const baseActiveSetChanges: object = {
  epoch: 0,
  activatedIndices: 0,
  exitedIndices: 0,
  slashedIndices: 0,
  ejectedIndices: 0,
};

const baseValidatorPerformanceRequest: object = {
  indices: 0,
};

const baseValidatorPerformanceResponse: object = {
  currentEffectiveBalances: 0,
  inclusionSlots: 0,
  inclusionDistances: 0,
  correctlyVotedSource: false,
  correctlyVotedTarget: false,
  correctlyVotedHead: false,
  balancesBeforeEpochTransition: 0,
  balancesAfterEpochTransition: 0,
  averageActiveValidatorBalance: 0,
};

const baseValidatorQueue: object = {
  churnLimit: 0,
  activationValidatorIndices: 0,
  exitValidatorIndices: 0,
};

const baseListValidatorAssignmentsRequest: object = {
  indices: 0,
  pageSize: 0,
  pageToken: "",
};

const baseValidatorAssignments: object = {
  epoch: 0,
  nextPageToken: "",
  totalSize: 0,
};

const baseValidatorAssignments_CommitteeAssignment: object = {
  beaconCommittees: 0,
  committeeIndex: 0,
  attesterSlot: 0,
  proposerSlots: 0,
  validatorIndex: 0,
};

const baseGetValidatorParticipationRequest: object = {
};

const baseValidatorParticipationResponse: object = {
  epoch: 0,
  finalized: false,
};

const baseAttestationPoolRequest: object = {
  pageSize: 0,
  pageToken: "",
};

const baseAttestationPoolResponse: object = {
  nextPageToken: "",
  totalSize: 0,
};

const baseBeaconConfig: object = {
};

const baseBeaconConfig_ConfigEntry: object = {
  key: "",
  value: "",
};

const baseSubmitSlashingResponse: object = {
  slashedIndices: 0,
};

const baseIndividualVotesRequest: object = {
  epoch: 0,
  indices: 0,
};

const baseIndividualVotesRespond: object = {
};

const baseIndividualVotesRespond_IndividualVote: object = {
  epoch: 0,
  validatorIndex: 0,
  isSlashed: false,
  isWithdrawableInCurrentEpoch: false,
  isActiveInCurrentEpoch: false,
  isActiveInPreviousEpoch: false,
  isCurrentEpochAttester: false,
  isCurrentEpochTargetAttester: false,
  isPreviousEpochAttester: false,
  isPreviousEpochTargetAttester: false,
  isPreviousEpochHeadAttester: false,
  currentEpochEffectiveBalanceGwei: 0,
  inclusionSlot: 0,
  inclusionDistance: 0,
};

/**  SetAction defines the type of action that should be applied to the keys in a validator change set.
 */
export enum SetAction {
  /** ADD_VALIDATOR_KEYS -  ADD_VALIDATOR_KEYS adds to the existing keys.
   */
  ADD_VALIDATOR_KEYS = 0,
  /** REMOVE_VALIDATOR_KEYS -  REMOVE_VALIDATOR_KEYS removes from the existing keys.
   */
  REMOVE_VALIDATOR_KEYS = 1,
  /** SET_VALIDATOR_KEYS -  SET_VALIDATOR_KEYS overwrites the existing keys.
   */
  SET_VALIDATOR_KEYS = 2,
  UNRECOGNIZED = -1,
}

export function setActionFromJSON(object: any): SetAction {
  switch (object) {
    case 0:
    case "ADD_VALIDATOR_KEYS":
      return SetAction.ADD_VALIDATOR_KEYS;
    case 1:
    case "REMOVE_VALIDATOR_KEYS":
      return SetAction.REMOVE_VALIDATOR_KEYS;
    case 2:
    case "SET_VALIDATOR_KEYS":
      return SetAction.SET_VALIDATOR_KEYS;
    case -1:
    case "UNRECOGNIZED":
    default:
      return SetAction.UNRECOGNIZED;
  }
}

export function setActionToJSON(object: SetAction): string {
  switch (object) {
    case SetAction.ADD_VALIDATOR_KEYS:
      return "ADD_VALIDATOR_KEYS";
    case SetAction.REMOVE_VALIDATOR_KEYS:
      return "REMOVE_VALIDATOR_KEYS";
    case SetAction.SET_VALIDATOR_KEYS:
      return "SET_VALIDATOR_KEYS";
    default:
      return "UNKNOWN";
  }
}