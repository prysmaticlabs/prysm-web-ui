import { ChainHead } from 'src/app/proto/eth/v1alpha1/beacon_chain';

/* eslint-disable */
export interface HasUsedWebResponse {
  hasSignedUp: boolean;
  hasWallet: boolean;
}

export interface CreateWalletRequest {
  /**
   *  Path on disk where the wallet will be stored.
   */
  walletPath: string;
  keymanager: string;
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

export interface CreateWalletResponse {
  wallet: WalletResponse;
}

export interface GenerateMnemonicResponse {
  mnemonic: string;
}

export interface WalletResponse {
  walletPath: string;
  keymanagerKind: string;
}

export interface LogsEndpointResponse {
  validatorLogsEndpoint: string;
  beaconLogsEndpoint: string;
}

export interface VersionResponse {
  beacon: string;
  validator: string;
}

export interface ListAccountsRequest {
  /**
   *  Whether or not to return the raw RLP deposit tx data.
   */
  getDepositTxData: boolean;
  /**
   *  The maximum number of data to return in the response.
   *  This field is optional.
   */
  pageSize: number;
  /**
   *  A pagination token returned from a previous call
   *  that indicates where this listing should continue from.
   *  This field is optional.
   */
  pageToken: string;
  /**
   *  Whether or not to return all acconts.
   */
  all: boolean;
}

export interface ListAccountsResponse {
  accounts: Account[];
  /**
   *  A pagination token returned from a previous call
   *  that indicates from where listing should continue.
   *  This field is optional.
   */
  nextPageToken: string;
  /**
   *  Total count matching the request filter.
   */
  totalSize: number;
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

export interface AuthRequest {
  password: string;
  passwordConfirmation: string;
}

export interface AuthResponse {
  token: string;
  tokenExpiration: number;
}

export interface BeaconStatusResponse {
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
  /**
   *  ChainHead of the beacon node.
   */
  chainHead: ChainHead;
}

export interface ChangePasswordRequest {
  /**
   *  Current UI password.
   */
  currentPassword: string;
  /**
   *  New password a user wishes to set.
   */
  password: string;
  /**
   *  Confirmation of the new password.
   */
  passwordConfirmation: string;
}

export interface ImportKeystoresRequest {
  /**
   *  JSON encoded keystore list.
   */
  keystoresImported: string[];
  /**
   *  Password to unlock the keystores.
   */
  keystoresPassword: string;
}

export interface ImportKeystoresResponse {
  /**
   *  Public keys successfully imported.
   */
  importedPublicKeys: string[];
}

export interface ValidateKeystoresRequest {
  /**
   *  JSON encoded keystore list.
   */
  keystores: string[];
  /**
   *  Password to unlock the keystores.
   */
  keystoresPassword: string;
}

export interface RecoverWalletRequest {
  /**
   * 24 word Mnemonics
   */
  mnemonic: string;
  /**
   * Num of accounts generated from the mnemonic
   */
  num_accounts: string;
  /**
   * The wallet password
   */
  wallet_password: string;
}

export interface AccountVoluntaryExitRequest {
  /**
   * The key from the accounts that will be removed
   */
  publicKeys: string[];
  /**
   * Confirmation if the exit should proceed or not
   */
  confrimation: string;
}

export interface DeleteAccountsRequest {
  /**
   *  Public keys to delete.
   */
  publicKeys: string[];
}

export interface BackupAccountsRequest {
  /**
   *  Public keys to backup.
   */
  publicKeys: string[];
  /**
   *  Keystores password to encrypt the backed-up accounts.
   */
  keystoresPassword: string;
}

export interface BackupAccountsResponse {
  /**
   *  Public keys to backup.
   */
  zipFile: string;
}
