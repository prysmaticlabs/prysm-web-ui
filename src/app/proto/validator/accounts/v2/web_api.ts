import { ChainHead } from 'src/app/proto/eth/v1alpha1/beacon_chain';

/* eslint-disable */
export interface InitializeAuthResponse {
  has_signed_up: boolean;
  has_wallet: boolean;
}

export interface CreateWalletRequest {
  
  keymanager: string;
  /**
   *  Password for the wallet.
   */
  wallet_password: string;
  /**
   *  Mnemonic in case the user is creating a derived wallet.
   */
  mnemonic: string;
  /**
   *  Number of accounts.
   */
  num_accounts: number;
  /**
   *  Remote address such as host.example.com:4000 for a gRPC remote signer server.
   */
  remote_addr: string;
  /**
   *  Path to client.crt for secure TLS connections to a remote signer server.
   */
  remote_crt_path: string;
  /**
   *  Path to client.key for secure TLS connections to a remote signer server.
   */
  remote_key_path: string;
  /**
   *  Path to ca.crt for secure TLS connections to a remote signer server.
   */
  remote_ca_crt_path: string;
}

export interface CreateWalletResponse {
  wallet: WalletResponse;
}

export interface GenerateMnemonicResponse {
  mnemonic: string;
}

export interface WalletResponse {
  /**
   *  Path on disk where the wallet will be stored.
   */
  wallet_path: string;
  keymanager_kind: string;
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
  get_deposit_tx_data: boolean;
  /**
   *  The maximum number of data to return in the response.
   *  This field is optional.
   */
  page_size: number;
  /**
   *  A pagination token returned from a previous call
   *  that indicates where this listing should continue from.
   *  This field is optional.
   */
  page_token: string;
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
  next_page_token: string;
  /**
   *  Total count matching the request filter.
   */
  total_size: number;
}

export interface Account {
  /**
   *  The validating public key.
   */
  validating_public_key: string;
  /**
   *  The human readable account name.
   */
  account_name: string;
  /**
   *  The deposit data transaction RLP bytes.
   */
  deposit_tx_data: string;
  /**
   *  The derivation path (if using HD wallet).
   */
  derivation_path: string;
}

export interface BeaconStatusResponse {
  /**
   *  The host address of the beacon node the validator
   *  client is connected to.
   */
  beacon_node_endpoint: string;
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
  genesis_time: number;
  /**
   *  Address of the validator deposit contract in the eth1 chain.
   */
  deposit_contract_address: string;
  /**
   *  ChainHead of the beacon node.
   */
  chain_head: ChainHead;
}

export interface ImportKeystoresRequest {
  /**
   *  JSON encoded keystore list.
   */
  keystores: string[];
  /**
   *  Password to unlock the keystores.
   */
  passwords: string[];
  slashing_protection: string | null;
}

export interface ImportKeystoresResponse {
  /**
   *  Public keys successfully imported.
   */
  
  data: ImportKeystoresData[];
  
}

export interface ImportKeystoresData {
  status: string;
  message: string;
}


export interface ValidateKeystoresRequest {
  /**
   *  JSON encoded keystore list.
   */
  keystores: string[];
  /**
   *  Password to unlock the keystores.
   */
  keystores_password: string;
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
  /**
   * The language of the mnemonic
   */
  language: string;

  mnemonic25th_word: string;
}

export interface AccountVoluntaryExitRequest {
  /**
   * The key from the accounts that will be removed
   */
  public_keys: string[];
}

export interface DeleteAccountsRequest {
  /**
   *  Public keys to delete.
   */
  public_keys_to_delete: string[];
}

export interface ExportSlashingProtectionResponse {
  /**
   * The slashing protection json
   */
  file: string;
}

export interface ImportSlashingProtectionRequest {
  /**
   * JSON representin the slash protection
   */
  slashing_protection_json: string;
}

export interface BackupAccountsRequest {
  /**
   *  Public keys to backup.
   */
  public_keys: string[];
  /**
   *  Keystores password to encrypt the backed-up accounts.
   */
  backup_password: string;
}

export interface BackupAccountsResponse {
  /**
   *  Public keys to backup.
   */
  zip_file: string;
}
