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

/**
 *  Information about the current network sync status of the node.
 */
export interface SyncStatus {
  /**
   *  Whether or not the node is currently syncing.
   */
  syncing: boolean;
}

/**
 *  Information about the genesis of Ethereum 2.0.
 */
export interface Genesis {
  /**
   *  UTC time specified in the chain start event in the deposit contract.
   */
  genesisTime: Date | undefined;
  /**
   *  Address of the deposit contract in the Ethereum 1 chain.
   */
  depositContractAddress: Uint8Array;
  /**
   *  Root of the genesis validators deposits; used for domain separation
   *  when signing data structures for this chain.
   */
  genesisValidatorsRoot: Uint8Array;
}

/**
 *  Information about the node version.
 */
export interface Version {
  /**
   *  A string that uniquely identifies the node and its version.
   */
  version: string;
  /**
   *  Additional metadata that the node would like to provide. This field may
   *  be used to list any meaningful data to the client.
   */
  metadata: string;
}

export interface ImplementedServices {
  services: string[];
}

export interface PeerRequest {
  /**
   *  Peer id of the peer requested.
   */
  peerId: string;
}

/**
 *  Peers is a list of peer messages.
 */
export interface Peers {
  peers: Peer[];
}

/**
 *  Peer provides details of a peer on the network.
 */
export interface Peer {
  /**
   *  The address of the peer, as a full multiaddr, for example:
   *  /ip4/37.221.192.134/tcp/13000/p2p/16Uiu2HAm8maLMjag1TAUM52zPfmLbVMGFdwUAWgoHu1HDQLR6e17
   */
  address: string;
  /**
   *  The direction of the connection (inbound/outbound).
   */
  direction: PeerDirection;
  /**
   *  The connection state of the peer at the moment of the request. (e.g. Connecting)
   */
  connectionState: ConnectionState;
  /**
   *  The peer id of the peer.
   */
  peerId: string;
  /**
   *  The latest ENR of the peer that's in the record.
   */
  enr: string;
}

/**
 *  P2P Data on the local host.
 */
export interface HostData {
  /**
   *  All the  multiaddress of the peer, specified as a full multiaddr, for example:
   *  /ip4/37.221.192.134/tcp/13000/p2p/16Uiu2HAm8maLMjag1TAUM52zPfmLbVMGFdwUAWgoHu1HDQLR6e17
   */
  addresses: string[];
  /**
   *  The peer id of the peer.
   */
  peerId: string;
  /**
   *  The latest ENR of the local peer.
   */
  enr: string;
}

const baseSyncStatus: object = {
  syncing: false,
};

const baseGenesis: object = {
};

const baseVersion: object = {
  version: "",
  metadata: "",
};

const baseImplementedServices: object = {
  services: "",
};

const basePeerRequest: object = {
  peerId: "",
};

const basePeers: object = {
};

const basePeer: object = {
  address: "",
  direction: 0,
  connectionState: 0,
  peerId: "",
  enr: "",
};

const baseHostData: object = {
  addresses: "",
  peerId: "",
  enr: "",
};

/**  PeerDirection states the direction of the connection to a peer.
 */
export enum PeerDirection {
  UNKNOWN = 0,
  INBOUND = 1,
  OUTBOUND = 2,
  UNRECOGNIZED = -1,
}

export function peerDirectionFromJSON(object: any): PeerDirection {
  switch (object) {
    case 0:
    case "UNKNOWN":
      return PeerDirection.UNKNOWN;
    case 1:
    case "INBOUND":
      return PeerDirection.INBOUND;
    case 2:
    case "OUTBOUND":
      return PeerDirection.OUTBOUND;
    case -1:
    case "UNRECOGNIZED":
    default:
      return PeerDirection.UNRECOGNIZED;
  }
}

export function peerDirectionToJSON(object: PeerDirection): string {
  switch (object) {
    case PeerDirection.UNKNOWN:
      return "UNKNOWN";
    case PeerDirection.INBOUND:
      return "INBOUND";
    case PeerDirection.OUTBOUND:
      return "OUTBOUND";
    default:
      return "UNKNOWN";
  }
}

/**  ConnectionState states the current status of the peer.
 */
export enum ConnectionState {
  DISCONNECTED = 0,
  DISCONNECTING = 1,
  CONNECTED = 2,
  CONNECTING = 3,
  UNRECOGNIZED = -1,
}

export function connectionStateFromJSON(object: any): ConnectionState {
  switch (object) {
    case 0:
    case "DISCONNECTED":
      return ConnectionState.DISCONNECTED;
    case 1:
    case "DISCONNECTING":
      return ConnectionState.DISCONNECTING;
    case 2:
    case "CONNECTED":
      return ConnectionState.CONNECTED;
    case 3:
    case "CONNECTING":
      return ConnectionState.CONNECTING;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ConnectionState.UNRECOGNIZED;
  }
}

export function connectionStateToJSON(object: ConnectionState): string {
  switch (object) {
    case ConnectionState.DISCONNECTED:
      return "DISCONNECTED";
    case ConnectionState.DISCONNECTING:
      return "DISCONNECTING";
    case ConnectionState.CONNECTED:
      return "CONNECTED";
    case ConnectionState.CONNECTING:
      return "CONNECTING";
    default:
      return "UNKNOWN";
  }
}
