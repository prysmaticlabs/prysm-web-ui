/* eslint-disable */

export interface CreateWalletRequest {
  /**
   *  Path on disk where the wallet will be stored.
   */
  walletPath: string;
  keymanager: CreateWalletRequest_KeymanagerKind;
  /**
   *  Password for the wallet.
   */
  walletPassword: string;
  /**
   *  Mnemonic in case the user is creating a derived wallet.
   */
  mnemonic: string;
  /**
   *  Number of accounts.
   */
  numAccounts: number;
  /**
   *  JSON-encoded keystore files to import during wallet creation.
   */
  keystoresImported: string[];
  /**
   *  Password to unlock imported keystore files.
   */
  keystoresPassword: string;
  /**
   *  Remote address such as host.example.com:4000 for a gRPC remote signer server.
   */
  remoteAddr: string;
  /**
   *  Path to client.crt for secure TLS connections to a remote signer server.
   */
  remoteCrtPath: string;
  /**
   *  Path to client.key for secure TLS connections to a remote signer server.
   */
  remoteKeyPath: string;
  /**
   *  Path to ca.crt for secure TLS connections to a remote signer server.
   */
  remoteCaCrtPath: string;
}

export interface EditWalletConfigRequest {
  remoteAddr: string;
  remoteCrtPath: string;
  remoteKeyPath: string;
  remoteCaCrtPath: string;
}

export interface GenerateMnemonicResponse {
  mnemonic: string;
}

export interface WalletResponse {
  walletPath: string;
  keymanagerKind: string;
  keymanagerConfig: WalletResponse_KeymanagerConfig | undefined;
}

/**
 *  Key manager configs, this is meant to be some what generic.
 *  It'll later be encoded with json to represent in front end UI.
 */
export interface WalletResponse_KeymanagerConfig {
  configs: { [key: string]: string };
}

export interface WalletResponse_KeymanagerConfig_ConfigsEntry {
  key: string;
  value: string;
}

export interface CreateAccountResponse {
  account: Account | undefined;
}

export interface ListAccountsRequest {
  /**
   *  Whether or not to return the raw RLP deposit tx data.
   */
  getDepositTxData: boolean;
}

export interface ListAccountsResponse {
  accounts: Account[];
}

export interface Account {
  /**
   *  The validating public key.
   */
  validatingPublicKey: string;
  /**
   *  The human readable account name.
   */
  accountName: string;
  /**
   *  The deposit data transaction RLP bytes.
   */
  depositTxData: string;
  /**
   *  The derivation path (if using HD wallet).
   */
  derivationPath: string;
}

export interface AccountRequest {
  /**
   *  A list of validator public keys.
   */
  publicKeys: string[];
  /**
   *  A list of validator indices.
   */
  indices: number[];
}

export interface AuthRequest {
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenExpiration: number;
}

export interface NodeConnectionResponse {
  /**
   *  The host address of the beacon node the validator
   *  client is connected to.
   */
  beaconNodeEndpoint: string;
  /**
   *  Whether the connection is active.
   */
  connected: boolean;
  /**
   *  Whether the beacon node is currently synchronizing to chain head.
   */
  syncing: boolean;
  /**
   *  The chain genesis time.
   */
  genesisTime: number;
  /**
   *  Address of the validator deposit contract in the eth1 chain.
   */
  depositContractAddress: string;
}

/**  Type of key manager for the wallet, either direct, derived, or remote.
 */
export enum CreateWalletRequest_KeymanagerKind {
  DERIVED = 0,
  DIRECT = 1,
  REMOTE = 2,
  UNRECOGNIZED = -1,
}

export function createWalletRequest_KeymanagerKindFromJSON(object: any): CreateWalletRequest_KeymanagerKind {
  switch (object) {
    case 0:
    case 'DERIVED':
      return CreateWalletRequest_KeymanagerKind.DERIVED;
    case 1:
    case 'DIRECT':
      return CreateWalletRequest_KeymanagerKind.DIRECT;
    case 2:
    case 'REMOTE':
      return CreateWalletRequest_KeymanagerKind.REMOTE;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return CreateWalletRequest_KeymanagerKind.UNRECOGNIZED;
  }
}

export function createWalletRequest_KeymanagerKindToJSON(object: CreateWalletRequest_KeymanagerKind): string {
  switch (object) {
    case CreateWalletRequest_KeymanagerKind.DERIVED:
      return 'DERIVED';
    case CreateWalletRequest_KeymanagerKind.DIRECT:
      return 'DIRECT';
    case CreateWalletRequest_KeymanagerKind.REMOTE:
      return 'REMOTE';
    default:
      return 'UNKNOWN';
  }
}
