/* eslint-disable */
import { Empty } from '../../../google/protobuf/empty';
import { Reader, Writer } from 'protobufjs/minimal';
import * as Long from 'long';


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

export interface WalletResponse {
  walletPath: string;
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
  validatingPublicKey: Uint8Array;
  /**
   *  The human readable account name.
   */
  accountName: string;
  /**
   *  The deposit data transaction RLP bytes.
   */
  depositTxData: Uint8Array;
  /**
   *  The derivation path (if using HD wallet).
   */
  derivationPath: string;
}

export interface AccountRequest {
  /**
   *  A list of validator public keys.
   */
  publicKeys: Uint8Array[];
  /**
   *  A list of validator indices.
   */
  indices: number[];
}

export interface ListBalancesResponse {
  /**
   *  A list of validator public keys.
   */
  publicKeys: Uint8Array[];
  /**
   *  A list of validator indices.
   */
  indices: number[];
  /**
   *  A list of validator balances that maps to public keys and indices.
   */
  balances: number[];
}

export interface ListStatusesResponse {
  /**
   *  A list of validator public keys.
   */
  publicKeys: Uint8Array[];
  /**
   *  A list of validator indices.
   */
  indices: number[];
  statuses: ListStatusesResponse_ValidatorStatus[];
}

export interface ListPerformanceResponse {
  /**
   *  A list of validator public keys.
   */
  publicKeys: Uint8Array[];
  /**
   *  A list of validator indices.
   */
  indices: number[];
  submissions: ListPerformanceResponse_Submission[];
}

/**
 *  A list of block / attestation submission count since last launch.
 */
export interface ListPerformanceResponse_Submission {
  blockCount: number;
  attestationCount: number;
}

export interface AuthRequest {
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenExpiration: number;
}

const baseCreateWalletRequest: object = {
  walletPath: "",
  keymanager: 0,
  walletPassword: "",
  remoteAddr: "",
  remoteCrtPath: "",
  remoteKeyPath: "",
  remoteCaCrtPath: "",
};

const baseEditWalletConfigRequest: object = {
  remoteAddr: "",
  remoteCrtPath: "",
  remoteKeyPath: "",
  remoteCaCrtPath: "",
};

const baseWalletResponse: object = {
  walletPath: "",
};

const baseWalletResponse_KeymanagerConfig: object = {
};

const baseWalletResponse_KeymanagerConfig_ConfigsEntry: object = {
  key: "",
  value: "",
};

const baseCreateAccountResponse: object = {
};

const baseListAccountsRequest: object = {
  getDepositTxData: false,
};

const baseListAccountsResponse: object = {
};

const baseAccount: object = {
  accountName: "",
  derivationPath: "",
};

const baseAccountRequest: object = {
  indices: 0,
};

const baseListBalancesResponse: object = {
  indices: 0,
  balances: 0,
};

const baseListStatusesResponse: object = {
  indices: 0,
  statuses: 0,
};

const baseListPerformanceResponse: object = {
  indices: 0,
};

const baseListPerformanceResponse_Submission: object = {
  blockCount: 0,
  attestationCount: 0,
};

const baseAuthRequest: object = {
  password: "",
};

const baseAuthResponse: object = {
  token: "",
  tokenExpiration: 0,
};

export interface Wallet {

  CreateWallet(request: CreateWalletRequest): Promise<WalletResponse>;

  EditConfig(request: EditWalletConfigRequest): Promise<WalletResponse>;

  WalletConfig(request: Empty): Promise<WalletResponse>;

}

export class WalletClientImpl implements Wallet {

  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }

  CreateWallet(request: CreateWalletRequest): Promise<WalletResponse> {
    const data = CreateWalletRequest.encode(request).finish();
    const promise = this.rpc.request("ethereum.validator.accounts.v2.Wallet", "CreateWallet", data);
    return promise.then(data => WalletResponse.decode(new Reader(data)));
  }

  EditConfig(request: EditWalletConfigRequest): Promise<WalletResponse> {
    const data = EditWalletConfigRequest.encode(request).finish();
    const promise = this.rpc.request("ethereum.validator.accounts.v2.Wallet", "EditConfig", data);
    return promise.then(data => WalletResponse.decode(new Reader(data)));
  }

  WalletConfig(request: Empty): Promise<WalletResponse> {
    const data = Empty.encode(request).finish();
    const promise = this.rpc.request("ethereum.validator.accounts.v2.Wallet", "WalletConfig", data);
    return promise.then(data => WalletResponse.decode(new Reader(data)));
  }

}

export interface Accounts {

  CreateAccount(request: Empty): Promise<CreateAccountResponse>;

  ListAccounts(request: ListAccountsRequest): Promise<ListAccountsResponse>;

}

export class AccountsClientImpl implements Accounts {

  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }

  CreateAccount(request: Empty): Promise<CreateAccountResponse> {
    const data = Empty.encode(request).finish();
    const promise = this.rpc.request("ethereum.validator.accounts.v2.Accounts", "CreateAccount", data);
    return promise.then(data => CreateAccountResponse.decode(new Reader(data)));
  }

  ListAccounts(request: ListAccountsRequest): Promise<ListAccountsResponse> {
    const data = ListAccountsRequest.encode(request).finish();
    const promise = this.rpc.request("ethereum.validator.accounts.v2.Accounts", "ListAccounts", data);
    return promise.then(data => ListAccountsResponse.decode(new Reader(data)));
  }

}

export interface Health {

  ListBalances(request: AccountRequest): Promise<ListBalancesResponse>;

  ListStatuses(request: AccountRequest): Promise<ListStatusesResponse>;

  ListPerformance(request: AccountRequest): Promise<ListPerformanceResponse>;

}

export class HealthClientImpl implements Health {

  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }

  ListBalances(request: AccountRequest): Promise<ListBalancesResponse> {
    const data = AccountRequest.encode(request).finish();
    const promise = this.rpc.request("ethereum.validator.accounts.v2.Health", "ListBalances", data);
    return promise.then(data => ListBalancesResponse.decode(new Reader(data)));
  }

  ListStatuses(request: AccountRequest): Promise<ListStatusesResponse> {
    const data = AccountRequest.encode(request).finish();
    const promise = this.rpc.request("ethereum.validator.accounts.v2.Health", "ListStatuses", data);
    return promise.then(data => ListStatusesResponse.decode(new Reader(data)));
  }

  ListPerformance(request: AccountRequest): Promise<ListPerformanceResponse> {
    const data = AccountRequest.encode(request).finish();
    const promise = this.rpc.request("ethereum.validator.accounts.v2.Health", "ListPerformance", data);
    return promise.then(data => ListPerformanceResponse.decode(new Reader(data)));
  }

}

export interface Auth {

  Login(request: AuthRequest): Promise<AuthResponse>;

  Signup(request: AuthRequest): Promise<AuthResponse>;

}

export class AuthClientImpl implements Auth {

  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }

  Login(request: AuthRequest): Promise<AuthResponse> {
    const data = AuthRequest.encode(request).finish();
    const promise = this.rpc.request("ethereum.validator.accounts.v2.Auth", "Login", data);
    return promise.then(data => AuthResponse.decode(new Reader(data)));
  }

  Signup(request: AuthRequest): Promise<AuthResponse> {
    const data = AuthRequest.encode(request).finish();
    const promise = this.rpc.request("ethereum.validator.accounts.v2.Auth", "Signup", data);
    return promise.then(data => AuthResponse.decode(new Reader(data)));
  }

}

interface Rpc {

  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;

}

function longToNumber(long: Long) {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
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
    case "DERIVED":
      return CreateWalletRequest_KeymanagerKind.DERIVED;
    case 1:
    case "DIRECT":
      return CreateWalletRequest_KeymanagerKind.DIRECT;
    case 2:
    case "REMOTE":
      return CreateWalletRequest_KeymanagerKind.REMOTE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return CreateWalletRequest_KeymanagerKind.UNRECOGNIZED;
  }
}

export function createWalletRequest_KeymanagerKindToJSON(object: CreateWalletRequest_KeymanagerKind): string {
  switch (object) {
    case CreateWalletRequest_KeymanagerKind.DERIVED:
      return "DERIVED";
    case CreateWalletRequest_KeymanagerKind.DIRECT:
      return "DIRECT";
    case CreateWalletRequest_KeymanagerKind.REMOTE:
      return "REMOTE";
    default:
      return "UNKNOWN";
  }
}

/**  A list of validator statuses that maps to public keys and indices.
 */
export enum ListStatusesResponse_ValidatorStatus {
  UNKNOWN_STATUS = 0,
  DEPOSITED = 1,
  PENDING = 2,
  ACTIVE = 3,
  EXITING = 4,
  SLASHING = 5,
  EXITED = 6,
  INVALID = 7,
  UNRECOGNIZED = -1,
}

export function listStatusesResponse_ValidatorStatusFromJSON(object: any): ListStatusesResponse_ValidatorStatus {
  switch (object) {
    case 0:
    case "UNKNOWN_STATUS":
      return ListStatusesResponse_ValidatorStatus.UNKNOWN_STATUS;
    case 1:
    case "DEPOSITED":
      return ListStatusesResponse_ValidatorStatus.DEPOSITED;
    case 2:
    case "PENDING":
      return ListStatusesResponse_ValidatorStatus.PENDING;
    case 3:
    case "ACTIVE":
      return ListStatusesResponse_ValidatorStatus.ACTIVE;
    case 4:
    case "EXITING":
      return ListStatusesResponse_ValidatorStatus.EXITING;
    case 5:
    case "SLASHING":
      return ListStatusesResponse_ValidatorStatus.SLASHING;
    case 6:
    case "EXITED":
      return ListStatusesResponse_ValidatorStatus.EXITED;
    case 7:
    case "INVALID":
      return ListStatusesResponse_ValidatorStatus.INVALID;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ListStatusesResponse_ValidatorStatus.UNRECOGNIZED;
  }
}

export function listStatusesResponse_ValidatorStatusToJSON(object: ListStatusesResponse_ValidatorStatus): string {
  switch (object) {
    case ListStatusesResponse_ValidatorStatus.UNKNOWN_STATUS:
      return "UNKNOWN_STATUS";
    case ListStatusesResponse_ValidatorStatus.DEPOSITED:
      return "DEPOSITED";
    case ListStatusesResponse_ValidatorStatus.PENDING:
      return "PENDING";
    case ListStatusesResponse_ValidatorStatus.ACTIVE:
      return "ACTIVE";
    case ListStatusesResponse_ValidatorStatus.EXITING:
      return "EXITING";
    case ListStatusesResponse_ValidatorStatus.SLASHING:
      return "SLASHING";
    case ListStatusesResponse_ValidatorStatus.EXITED:
      return "EXITED";
    case ListStatusesResponse_ValidatorStatus.INVALID:
      return "INVALID";
    default:
      return "UNKNOWN";
  }
}

export const CreateWalletRequest = {
  encode(message: CreateWalletRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.walletPath);
    writer.uint32(16).int32(message.keymanager);
    writer.uint32(26).string(message.walletPassword);
    writer.uint32(34).string(message.remoteAddr);
    writer.uint32(42).string(message.remoteCrtPath);
    writer.uint32(50).string(message.remoteKeyPath);
    writer.uint32(58).string(message.remoteCaCrtPath);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): CreateWalletRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCreateWalletRequest } as CreateWalletRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.walletPath = reader.string();
          break;
        case 2:
          message.keymanager = reader.int32() as any;
          break;
        case 3:
          message.walletPassword = reader.string();
          break;
        case 4:
          message.remoteAddr = reader.string();
          break;
        case 5:
          message.remoteCrtPath = reader.string();
          break;
        case 6:
          message.remoteKeyPath = reader.string();
          break;
        case 7:
          message.remoteCaCrtPath = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreateWalletRequest {
    const message = { ...baseCreateWalletRequest } as CreateWalletRequest;
    if (object.walletPath !== undefined && object.walletPath !== null) {
      message.walletPath = String(object.walletPath);
    } else {
      message.walletPath = "";
    }
    if (object.keymanager !== undefined && object.keymanager !== null) {
      message.keymanager = createWalletRequest_KeymanagerKindFromJSON(object.keymanager);
    } else {
      message.keymanager = 0;
    }
    if (object.walletPassword !== undefined && object.walletPassword !== null) {
      message.walletPassword = String(object.walletPassword);
    } else {
      message.walletPassword = "";
    }
    if (object.remoteAddr !== undefined && object.remoteAddr !== null) {
      message.remoteAddr = String(object.remoteAddr);
    } else {
      message.remoteAddr = "";
    }
    if (object.remoteCrtPath !== undefined && object.remoteCrtPath !== null) {
      message.remoteCrtPath = String(object.remoteCrtPath);
    } else {
      message.remoteCrtPath = "";
    }
    if (object.remoteKeyPath !== undefined && object.remoteKeyPath !== null) {
      message.remoteKeyPath = String(object.remoteKeyPath);
    } else {
      message.remoteKeyPath = "";
    }
    if (object.remoteCaCrtPath !== undefined && object.remoteCaCrtPath !== null) {
      message.remoteCaCrtPath = String(object.remoteCaCrtPath);
    } else {
      message.remoteCaCrtPath = "";
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreateWalletRequest>): CreateWalletRequest {
    const message = { ...baseCreateWalletRequest } as CreateWalletRequest;
    if (object.walletPath !== undefined && object.walletPath !== null) {
      message.walletPath = object.walletPath;
    } else {
      message.walletPath = "";
    }
    if (object.keymanager !== undefined && object.keymanager !== null) {
      message.keymanager = object.keymanager;
    } else {
      message.keymanager = 0;
    }
    if (object.walletPassword !== undefined && object.walletPassword !== null) {
      message.walletPassword = object.walletPassword;
    } else {
      message.walletPassword = "";
    }
    if (object.remoteAddr !== undefined && object.remoteAddr !== null) {
      message.remoteAddr = object.remoteAddr;
    } else {
      message.remoteAddr = "";
    }
    if (object.remoteCrtPath !== undefined && object.remoteCrtPath !== null) {
      message.remoteCrtPath = object.remoteCrtPath;
    } else {
      message.remoteCrtPath = "";
    }
    if (object.remoteKeyPath !== undefined && object.remoteKeyPath !== null) {
      message.remoteKeyPath = object.remoteKeyPath;
    } else {
      message.remoteKeyPath = "";
    }
    if (object.remoteCaCrtPath !== undefined && object.remoteCaCrtPath !== null) {
      message.remoteCaCrtPath = object.remoteCaCrtPath;
    } else {
      message.remoteCaCrtPath = "";
    }
    return message;
  },
  toJSON(message: CreateWalletRequest): unknown {
    const obj: any = {};
    obj.walletPath = message.walletPath || "";
    obj.keymanager = createWalletRequest_KeymanagerKindToJSON(message.keymanager);
    obj.walletPassword = message.walletPassword || "";
    obj.remoteAddr = message.remoteAddr || "";
    obj.remoteCrtPath = message.remoteCrtPath || "";
    obj.remoteKeyPath = message.remoteKeyPath || "";
    obj.remoteCaCrtPath = message.remoteCaCrtPath || "";
    return obj;
  },
};

export const EditWalletConfigRequest = {
  encode(message: EditWalletConfigRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.remoteAddr);
    writer.uint32(18).string(message.remoteCrtPath);
    writer.uint32(26).string(message.remoteKeyPath);
    writer.uint32(34).string(message.remoteCaCrtPath);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): EditWalletConfigRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseEditWalletConfigRequest } as EditWalletConfigRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.remoteAddr = reader.string();
          break;
        case 2:
          message.remoteCrtPath = reader.string();
          break;
        case 3:
          message.remoteKeyPath = reader.string();
          break;
        case 4:
          message.remoteCaCrtPath = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): EditWalletConfigRequest {
    const message = { ...baseEditWalletConfigRequest } as EditWalletConfigRequest;
    if (object.remoteAddr !== undefined && object.remoteAddr !== null) {
      message.remoteAddr = String(object.remoteAddr);
    } else {
      message.remoteAddr = "";
    }
    if (object.remoteCrtPath !== undefined && object.remoteCrtPath !== null) {
      message.remoteCrtPath = String(object.remoteCrtPath);
    } else {
      message.remoteCrtPath = "";
    }
    if (object.remoteKeyPath !== undefined && object.remoteKeyPath !== null) {
      message.remoteKeyPath = String(object.remoteKeyPath);
    } else {
      message.remoteKeyPath = "";
    }
    if (object.remoteCaCrtPath !== undefined && object.remoteCaCrtPath !== null) {
      message.remoteCaCrtPath = String(object.remoteCaCrtPath);
    } else {
      message.remoteCaCrtPath = "";
    }
    return message;
  },
  fromPartial(object: DeepPartial<EditWalletConfigRequest>): EditWalletConfigRequest {
    const message = { ...baseEditWalletConfigRequest } as EditWalletConfigRequest;
    if (object.remoteAddr !== undefined && object.remoteAddr !== null) {
      message.remoteAddr = object.remoteAddr;
    } else {
      message.remoteAddr = "";
    }
    if (object.remoteCrtPath !== undefined && object.remoteCrtPath !== null) {
      message.remoteCrtPath = object.remoteCrtPath;
    } else {
      message.remoteCrtPath = "";
    }
    if (object.remoteKeyPath !== undefined && object.remoteKeyPath !== null) {
      message.remoteKeyPath = object.remoteKeyPath;
    } else {
      message.remoteKeyPath = "";
    }
    if (object.remoteCaCrtPath !== undefined && object.remoteCaCrtPath !== null) {
      message.remoteCaCrtPath = object.remoteCaCrtPath;
    } else {
      message.remoteCaCrtPath = "";
    }
    return message;
  },
  toJSON(message: EditWalletConfigRequest): unknown {
    const obj: any = {};
    obj.remoteAddr = message.remoteAddr || "";
    obj.remoteCrtPath = message.remoteCrtPath || "";
    obj.remoteKeyPath = message.remoteKeyPath || "";
    obj.remoteCaCrtPath = message.remoteCaCrtPath || "";
    return obj;
  },
};

export const WalletResponse = {
  encode(message: WalletResponse, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.walletPath);
    if (message.keymanagerConfig !== undefined && message.keymanagerConfig !== undefined) {
      WalletResponse_KeymanagerConfig.encode(message.keymanagerConfig, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): WalletResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseWalletResponse } as WalletResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.walletPath = reader.string();
          break;
        case 2:
          message.keymanagerConfig = WalletResponse_KeymanagerConfig.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): WalletResponse {
    const message = { ...baseWalletResponse } as WalletResponse;
    if (object.walletPath !== undefined && object.walletPath !== null) {
      message.walletPath = String(object.walletPath);
    } else {
      message.walletPath = "";
    }
    if (object.keymanagerConfig !== undefined && object.keymanagerConfig !== null) {
      message.keymanagerConfig = WalletResponse_KeymanagerConfig.fromJSON(object.keymanagerConfig);
    } else {
      message.keymanagerConfig = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<WalletResponse>): WalletResponse {
    const message = { ...baseWalletResponse } as WalletResponse;
    if (object.walletPath !== undefined && object.walletPath !== null) {
      message.walletPath = object.walletPath;
    } else {
      message.walletPath = "";
    }
    if (object.keymanagerConfig !== undefined && object.keymanagerConfig !== null) {
      message.keymanagerConfig = WalletResponse_KeymanagerConfig.fromPartial(object.keymanagerConfig);
    } else {
      message.keymanagerConfig = undefined;
    }
    return message;
  },
  toJSON(message: WalletResponse): unknown {
    const obj: any = {};
    obj.walletPath = message.walletPath || "";
    obj.keymanagerConfig = message.keymanagerConfig ? WalletResponse_KeymanagerConfig.toJSON(message.keymanagerConfig) : undefined;
    return obj;
  },
};

export const WalletResponse_KeymanagerConfig = {
  encode(message: WalletResponse_KeymanagerConfig, writer: Writer = Writer.create()): Writer {
    Object.entries(message.configs).forEach(([key, value]) => {
      WalletResponse_KeymanagerConfig_ConfigsEntry.encode({ key: key as any, value }, writer.uint32(10).fork()).ldelim();
    })
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): WalletResponse_KeymanagerConfig {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseWalletResponse_KeymanagerConfig } as WalletResponse_KeymanagerConfig;
    message.configs = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          const entry1 = WalletResponse_KeymanagerConfig_ConfigsEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.configs[entry1.key] = entry1.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): WalletResponse_KeymanagerConfig {
    const message = { ...baseWalletResponse_KeymanagerConfig } as WalletResponse_KeymanagerConfig;
    message.configs = {};
    if (object.configs !== undefined && object.configs !== null) {
      Object.entries(object.configs).forEach(([key, value]) => {
        message.configs[key] = String(value);
      })
    }
    return message;
  },
  fromPartial(object: DeepPartial<WalletResponse_KeymanagerConfig>): WalletResponse_KeymanagerConfig {
    const message = { ...baseWalletResponse_KeymanagerConfig } as WalletResponse_KeymanagerConfig;
    message.configs = {};
    if (object.configs !== undefined && object.configs !== null) {
      Object.entries(object.configs).forEach(([key, value]) => {
        if (value !== undefined) {
          message.configs[key] = String(value);
        }
      })
    }
    return message;
  },
  toJSON(message: WalletResponse_KeymanagerConfig): unknown {
    const obj: any = {};
    obj.configs = {};
    if (message.configs) {
      Object.entries(message.configs).forEach(([k, v]) => {
        obj.configs[k] = v;
      })
    }
    return obj;
  },
};

export const WalletResponse_KeymanagerConfig_ConfigsEntry = {
  encode(message: WalletResponse_KeymanagerConfig_ConfigsEntry, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.key);
    writer.uint32(18).string(message.value);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): WalletResponse_KeymanagerConfig_ConfigsEntry {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseWalletResponse_KeymanagerConfig_ConfigsEntry } as WalletResponse_KeymanagerConfig_ConfigsEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): WalletResponse_KeymanagerConfig_ConfigsEntry {
    const message = { ...baseWalletResponse_KeymanagerConfig_ConfigsEntry } as WalletResponse_KeymanagerConfig_ConfigsEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key);
    } else {
      message.key = "";
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = String(object.value);
    } else {
      message.value = "";
    }
    return message;
  },
  fromPartial(object: DeepPartial<WalletResponse_KeymanagerConfig_ConfigsEntry>): WalletResponse_KeymanagerConfig_ConfigsEntry {
    const message = { ...baseWalletResponse_KeymanagerConfig_ConfigsEntry } as WalletResponse_KeymanagerConfig_ConfigsEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    } else {
      message.key = "";
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = object.value;
    } else {
      message.value = "";
    }
    return message;
  },
  toJSON(message: WalletResponse_KeymanagerConfig_ConfigsEntry): unknown {
    const obj: any = {};
    obj.key = message.key || "";
    obj.value = message.value || "";
    return obj;
  },
};

export const CreateAccountResponse = {
  encode(message: CreateAccountResponse, writer: Writer = Writer.create()): Writer {
    if (message.account !== undefined && message.account !== undefined) {
      Account.encode(message.account, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): CreateAccountResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCreateAccountResponse } as CreateAccountResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.account = Account.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreateAccountResponse {
    const message = { ...baseCreateAccountResponse } as CreateAccountResponse;
    if (object.account !== undefined && object.account !== null) {
      message.account = Account.fromJSON(object.account);
    } else {
      message.account = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreateAccountResponse>): CreateAccountResponse {
    const message = { ...baseCreateAccountResponse } as CreateAccountResponse;
    if (object.account !== undefined && object.account !== null) {
      message.account = Account.fromPartial(object.account);
    } else {
      message.account = undefined;
    }
    return message;
  },
  toJSON(message: CreateAccountResponse): unknown {
    const obj: any = {};
    obj.account = message.account ? Account.toJSON(message.account) : undefined;
    return obj;
  },
};

export const ListAccountsRequest = {
  encode(message: ListAccountsRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).bool(message.getDepositTxData);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): ListAccountsRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseListAccountsRequest } as ListAccountsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.getDepositTxData = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ListAccountsRequest {
    const message = { ...baseListAccountsRequest } as ListAccountsRequest;
    if (object.getDepositTxData !== undefined && object.getDepositTxData !== null) {
      message.getDepositTxData = Boolean(object.getDepositTxData);
    } else {
      message.getDepositTxData = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ListAccountsRequest>): ListAccountsRequest {
    const message = { ...baseListAccountsRequest } as ListAccountsRequest;
    if (object.getDepositTxData !== undefined && object.getDepositTxData !== null) {
      message.getDepositTxData = object.getDepositTxData;
    } else {
      message.getDepositTxData = false;
    }
    return message;
  },
  toJSON(message: ListAccountsRequest): unknown {
    const obj: any = {};
    obj.getDepositTxData = message.getDepositTxData || false;
    return obj;
  },
};

export const ListAccountsResponse = {
  encode(message: ListAccountsResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.accounts) {
      Account.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): ListAccountsResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseListAccountsResponse } as ListAccountsResponse;
    message.accounts = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accounts.push(Account.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ListAccountsResponse {
    const message = { ...baseListAccountsResponse } as ListAccountsResponse;
    message.accounts = [];
    if (object.accounts !== undefined && object.accounts !== null) {
      for (const e of object.accounts) {
        message.accounts.push(Account.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<ListAccountsResponse>): ListAccountsResponse {
    const message = { ...baseListAccountsResponse } as ListAccountsResponse;
    message.accounts = [];
    if (object.accounts !== undefined && object.accounts !== null) {
      for (const e of object.accounts) {
        message.accounts.push(Account.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: ListAccountsResponse): unknown {
    const obj: any = {};
    if (message.accounts) {
      obj.accounts = message.accounts.map(e => e ? Account.toJSON(e) : undefined);
    } else {
      obj.accounts = [];
    }
    return obj;
  },
};

export const Account = {
  encode(message: Account, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).bytes(message.validatingPublicKey);
    writer.uint32(18).string(message.accountName);
    writer.uint32(26).bytes(message.depositTxData);
    writer.uint32(34).string(message.derivationPath);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): Account {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseAccount } as Account;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validatingPublicKey = reader.bytes();
          break;
        case 2:
          message.accountName = reader.string();
          break;
        case 3:
          message.depositTxData = reader.bytes();
          break;
        case 4:
          message.derivationPath = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Account {
    const message = { ...baseAccount } as Account;
    if (object.validatingPublicKey !== undefined && object.validatingPublicKey !== null) {
      message.validatingPublicKey = bytesFromBase64(object.validatingPublicKey);
    }
    if (object.accountName !== undefined && object.accountName !== null) {
      message.accountName = String(object.accountName);
    } else {
      message.accountName = "";
    }
    if (object.depositTxData !== undefined && object.depositTxData !== null) {
      message.depositTxData = bytesFromBase64(object.depositTxData);
    }
    if (object.derivationPath !== undefined && object.derivationPath !== null) {
      message.derivationPath = String(object.derivationPath);
    } else {
      message.derivationPath = "";
    }
    return message;
  },
  fromPartial(object: DeepPartial<Account>): Account {
    const message = { ...baseAccount } as Account;
    if (object.validatingPublicKey !== undefined && object.validatingPublicKey !== null) {
      message.validatingPublicKey = object.validatingPublicKey;
    }
    if (object.accountName !== undefined && object.accountName !== null) {
      message.accountName = object.accountName;
    } else {
      message.accountName = "";
    }
    if (object.depositTxData !== undefined && object.depositTxData !== null) {
      message.depositTxData = object.depositTxData;
    }
    if (object.derivationPath !== undefined && object.derivationPath !== null) {
      message.derivationPath = object.derivationPath;
    } else {
      message.derivationPath = "";
    }
    return message;
  },
  toJSON(message: Account): unknown {
    const obj: any = {};
    obj.validatingPublicKey = message.validatingPublicKey !== undefined ? base64FromBytes(message.validatingPublicKey) : undefined;
    obj.accountName = message.accountName || "";
    obj.depositTxData = message.depositTxData !== undefined ? base64FromBytes(message.depositTxData) : undefined;
    obj.derivationPath = message.derivationPath || "";
    return obj;
  },
};

export const AccountRequest = {
  encode(message: AccountRequest, writer: Writer = Writer.create()): Writer {
    for (const v of message.publicKeys) {
      writer.uint32(10).bytes(v!);
    }
    writer.uint32(18).fork();
    for (const v of message.indices) {
      writer.uint64(v);
    }
    writer.ldelim();
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): AccountRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseAccountRequest } as AccountRequest;
    message.publicKeys = [];
    message.indices = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.publicKeys.push(reader.bytes());
          break;
        case 2:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.indices.push(longToNumber(reader.uint64() as Long));
            }
          } else {
            message.indices.push(longToNumber(reader.uint64() as Long));
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): AccountRequest {
    const message = { ...baseAccountRequest } as AccountRequest;
    message.publicKeys = [];
    message.indices = [];
    if (object.publicKeys !== undefined && object.publicKeys !== null) {
      for (const e of object.publicKeys) {
        message.publicKeys.push(bytesFromBase64(e));
      }
    }
    if (object.indices !== undefined && object.indices !== null) {
      for (const e of object.indices) {
        message.indices.push(Number(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<AccountRequest>): AccountRequest {
    const message = { ...baseAccountRequest } as AccountRequest;
    message.publicKeys = [];
    message.indices = [];
    if (object.publicKeys !== undefined && object.publicKeys !== null) {
      for (const e of object.publicKeys) {
        message.publicKeys.push(e);
      }
    }
    if (object.indices !== undefined && object.indices !== null) {
      for (const e of object.indices) {
        message.indices.push(e);
      }
    }
    return message;
  },
  toJSON(message: AccountRequest): unknown {
    const obj: any = {};
    if (message.publicKeys) {
      obj.publicKeys = message.publicKeys.map(e => e !== undefined ? base64FromBytes(e) : undefined);
    } else {
      obj.publicKeys = [];
    }
    if (message.indices) {
      obj.indices = message.indices.map(e => e || 0);
    } else {
      obj.indices = [];
    }
    return obj;
  },
};

export const ListBalancesResponse = {
  encode(message: ListBalancesResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.publicKeys) {
      writer.uint32(10).bytes(v!);
    }
    writer.uint32(18).fork();
    for (const v of message.indices) {
      writer.uint64(v);
    }
    writer.ldelim();
    writer.uint32(26).fork();
    for (const v of message.balances) {
      writer.uint64(v);
    }
    writer.ldelim();
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): ListBalancesResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseListBalancesResponse } as ListBalancesResponse;
    message.publicKeys = [];
    message.indices = [];
    message.balances = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.publicKeys.push(reader.bytes());
          break;
        case 2:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.indices.push(longToNumber(reader.uint64() as Long));
            }
          } else {
            message.indices.push(longToNumber(reader.uint64() as Long));
          }
          break;
        case 3:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.balances.push(longToNumber(reader.uint64() as Long));
            }
          } else {
            message.balances.push(longToNumber(reader.uint64() as Long));
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ListBalancesResponse {
    const message = { ...baseListBalancesResponse } as ListBalancesResponse;
    message.publicKeys = [];
    message.indices = [];
    message.balances = [];
    if (object.publicKeys !== undefined && object.publicKeys !== null) {
      for (const e of object.publicKeys) {
        message.publicKeys.push(bytesFromBase64(e));
      }
    }
    if (object.indices !== undefined && object.indices !== null) {
      for (const e of object.indices) {
        message.indices.push(Number(e));
      }
    }
    if (object.balances !== undefined && object.balances !== null) {
      for (const e of object.balances) {
        message.balances.push(Number(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<ListBalancesResponse>): ListBalancesResponse {
    const message = { ...baseListBalancesResponse } as ListBalancesResponse;
    message.publicKeys = [];
    message.indices = [];
    message.balances = [];
    if (object.publicKeys !== undefined && object.publicKeys !== null) {
      for (const e of object.publicKeys) {
        message.publicKeys.push(e);
      }
    }
    if (object.indices !== undefined && object.indices !== null) {
      for (const e of object.indices) {
        message.indices.push(e);
      }
    }
    if (object.balances !== undefined && object.balances !== null) {
      for (const e of object.balances) {
        message.balances.push(e);
      }
    }
    return message;
  },
  toJSON(message: ListBalancesResponse): unknown {
    const obj: any = {};
    if (message.publicKeys) {
      obj.publicKeys = message.publicKeys.map(e => e !== undefined ? base64FromBytes(e) : undefined);
    } else {
      obj.publicKeys = [];
    }
    if (message.indices) {
      obj.indices = message.indices.map(e => e || 0);
    } else {
      obj.indices = [];
    }
    if (message.balances) {
      obj.balances = message.balances.map(e => e || 0);
    } else {
      obj.balances = [];
    }
    return obj;
  },
};

export const ListStatusesResponse = {
  encode(message: ListStatusesResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.publicKeys) {
      writer.uint32(10).bytes(v!);
    }
    writer.uint32(18).fork();
    for (const v of message.indices) {
      writer.uint64(v);
    }
    writer.ldelim();
    writer.uint32(26).fork();
    for (const v of message.statuses) {
      writer.int32(v);
    }
    writer.ldelim();
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): ListStatusesResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseListStatusesResponse } as ListStatusesResponse;
    message.publicKeys = [];
    message.indices = [];
    message.statuses = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.publicKeys.push(reader.bytes());
          break;
        case 2:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.indices.push(longToNumber(reader.uint64() as Long));
            }
          } else {
            message.indices.push(longToNumber(reader.uint64() as Long));
          }
          break;
        case 3:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.statuses.push(reader.int32() as any);
            }
          } else {
            message.statuses.push(reader.int32() as any);
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ListStatusesResponse {
    const message = { ...baseListStatusesResponse } as ListStatusesResponse;
    message.publicKeys = [];
    message.indices = [];
    message.statuses = [];
    if (object.publicKeys !== undefined && object.publicKeys !== null) {
      for (const e of object.publicKeys) {
        message.publicKeys.push(bytesFromBase64(e));
      }
    }
    if (object.indices !== undefined && object.indices !== null) {
      for (const e of object.indices) {
        message.indices.push(Number(e));
      }
    }
    if (object.statuses !== undefined && object.statuses !== null) {
      for (const e of object.statuses) {
        message.statuses.push(listStatusesResponse_ValidatorStatusFromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<ListStatusesResponse>): ListStatusesResponse {
    const message = { ...baseListStatusesResponse } as ListStatusesResponse;
    message.publicKeys = [];
    message.indices = [];
    message.statuses = [];
    if (object.publicKeys !== undefined && object.publicKeys !== null) {
      for (const e of object.publicKeys) {
        message.publicKeys.push(e);
      }
    }
    if (object.indices !== undefined && object.indices !== null) {
      for (const e of object.indices) {
        message.indices.push(e);
      }
    }
    if (object.statuses !== undefined && object.statuses !== null) {
      for (const e of object.statuses) {
        message.statuses.push(e);
      }
    }
    return message;
  },
  toJSON(message: ListStatusesResponse): unknown {
    const obj: any = {};
    if (message.publicKeys) {
      obj.publicKeys = message.publicKeys.map(e => e !== undefined ? base64FromBytes(e) : undefined);
    } else {
      obj.publicKeys = [];
    }
    if (message.indices) {
      obj.indices = message.indices.map(e => e || 0);
    } else {
      obj.indices = [];
    }
    if (message.statuses) {
      obj.statuses = message.statuses.map(e => listStatusesResponse_ValidatorStatusToJSON(e));
    } else {
      obj.statuses = [];
    }
    return obj;
  },
};

export const ListPerformanceResponse = {
  encode(message: ListPerformanceResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.publicKeys) {
      writer.uint32(10).bytes(v!);
    }
    writer.uint32(18).fork();
    for (const v of message.indices) {
      writer.uint64(v);
    }
    writer.ldelim();
    for (const v of message.submissions) {
      ListPerformanceResponse_Submission.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): ListPerformanceResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseListPerformanceResponse } as ListPerformanceResponse;
    message.publicKeys = [];
    message.indices = [];
    message.submissions = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.publicKeys.push(reader.bytes());
          break;
        case 2:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.indices.push(longToNumber(reader.uint64() as Long));
            }
          } else {
            message.indices.push(longToNumber(reader.uint64() as Long));
          }
          break;
        case 3:
          message.submissions.push(ListPerformanceResponse_Submission.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ListPerformanceResponse {
    const message = { ...baseListPerformanceResponse } as ListPerformanceResponse;
    message.publicKeys = [];
    message.indices = [];
    message.submissions = [];
    if (object.publicKeys !== undefined && object.publicKeys !== null) {
      for (const e of object.publicKeys) {
        message.publicKeys.push(bytesFromBase64(e));
      }
    }
    if (object.indices !== undefined && object.indices !== null) {
      for (const e of object.indices) {
        message.indices.push(Number(e));
      }
    }
    if (object.submissions !== undefined && object.submissions !== null) {
      for (const e of object.submissions) {
        message.submissions.push(ListPerformanceResponse_Submission.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<ListPerformanceResponse>): ListPerformanceResponse {
    const message = { ...baseListPerformanceResponse } as ListPerformanceResponse;
    message.publicKeys = [];
    message.indices = [];
    message.submissions = [];
    if (object.publicKeys !== undefined && object.publicKeys !== null) {
      for (const e of object.publicKeys) {
        message.publicKeys.push(e);
      }
    }
    if (object.indices !== undefined && object.indices !== null) {
      for (const e of object.indices) {
        message.indices.push(e);
      }
    }
    if (object.submissions !== undefined && object.submissions !== null) {
      for (const e of object.submissions) {
        message.submissions.push(ListPerformanceResponse_Submission.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: ListPerformanceResponse): unknown {
    const obj: any = {};
    if (message.publicKeys) {
      obj.publicKeys = message.publicKeys.map(e => e !== undefined ? base64FromBytes(e) : undefined);
    } else {
      obj.publicKeys = [];
    }
    if (message.indices) {
      obj.indices = message.indices.map(e => e || 0);
    } else {
      obj.indices = [];
    }
    if (message.submissions) {
      obj.submissions = message.submissions.map(e => e ? ListPerformanceResponse_Submission.toJSON(e) : undefined);
    } else {
      obj.submissions = [];
    }
    return obj;
  },
};

export const ListPerformanceResponse_Submission = {
  encode(message: ListPerformanceResponse_Submission, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).uint64(message.blockCount);
    writer.uint32(16).uint64(message.attestationCount);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): ListPerformanceResponse_Submission {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseListPerformanceResponse_Submission } as ListPerformanceResponse_Submission;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.blockCount = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.attestationCount = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ListPerformanceResponse_Submission {
    const message = { ...baseListPerformanceResponse_Submission } as ListPerformanceResponse_Submission;
    if (object.blockCount !== undefined && object.blockCount !== null) {
      message.blockCount = Number(object.blockCount);
    } else {
      message.blockCount = 0;
    }
    if (object.attestationCount !== undefined && object.attestationCount !== null) {
      message.attestationCount = Number(object.attestationCount);
    } else {
      message.attestationCount = 0;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ListPerformanceResponse_Submission>): ListPerformanceResponse_Submission {
    const message = { ...baseListPerformanceResponse_Submission } as ListPerformanceResponse_Submission;
    if (object.blockCount !== undefined && object.blockCount !== null) {
      message.blockCount = object.blockCount;
    } else {
      message.blockCount = 0;
    }
    if (object.attestationCount !== undefined && object.attestationCount !== null) {
      message.attestationCount = object.attestationCount;
    } else {
      message.attestationCount = 0;
    }
    return message;
  },
  toJSON(message: ListPerformanceResponse_Submission): unknown {
    const obj: any = {};
    obj.blockCount = message.blockCount || 0;
    obj.attestationCount = message.attestationCount || 0;
    return obj;
  },
};

export const AuthRequest = {
  encode(message: AuthRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.password);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): AuthRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseAuthRequest } as AuthRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.password = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): AuthRequest {
    const message = { ...baseAuthRequest } as AuthRequest;
    if (object.password !== undefined && object.password !== null) {
      message.password = String(object.password);
    } else {
      message.password = "";
    }
    return message;
  },
  fromPartial(object: DeepPartial<AuthRequest>): AuthRequest {
    const message = { ...baseAuthRequest } as AuthRequest;
    if (object.password !== undefined && object.password !== null) {
      message.password = object.password;
    } else {
      message.password = "";
    }
    return message;
  },
  toJSON(message: AuthRequest): unknown {
    const obj: any = {};
    obj.password = message.password || "";
    return obj;
  },
};

export const AuthResponse = {
  encode(message: AuthResponse, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.token);
    writer.uint32(16).uint64(message.tokenExpiration);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): AuthResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseAuthResponse } as AuthResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.token = reader.string();
          break;
        case 2:
          message.tokenExpiration = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): AuthResponse {
    const message = { ...baseAuthResponse } as AuthResponse;
    if (object.token !== undefined && object.token !== null) {
      message.token = String(object.token);
    } else {
      message.token = "";
    }
    if (object.tokenExpiration !== undefined && object.tokenExpiration !== null) {
      message.tokenExpiration = Number(object.tokenExpiration);
    } else {
      message.tokenExpiration = 0;
    }
    return message;
  },
  fromPartial(object: DeepPartial<AuthResponse>): AuthResponse {
    const message = { ...baseAuthResponse } as AuthResponse;
    if (object.token !== undefined && object.token !== null) {
      message.token = object.token;
    } else {
      message.token = "";
    }
    if (object.tokenExpiration !== undefined && object.tokenExpiration !== null) {
      message.tokenExpiration = object.tokenExpiration;
    } else {
      message.tokenExpiration = 0;
    }
    return message;
  },
  toJSON(message: AuthResponse): unknown {
    const obj: any = {};
    obj.token = message.token || "";
    obj.tokenExpiration = message.tokenExpiration || 0;
    return obj;
  },
};

interface WindowBase64 {
  atob(b64: string): string;
  btoa(bin: string): string;
}

const windowBase64 = (globalThis as unknown as WindowBase64);
const atob = windowBase64.atob || ((b64: string) => Buffer.from(b64, 'base64').toString('binary'));
const btoa = windowBase64.btoa || ((bin: string) => Buffer.from(bin, 'binary').toString('base64'));

function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  for (let i = 0; i < arr.byteLength; ++i) {
    bin.push(String.fromCharCode(arr[i]));
  }
  return btoa(bin.join(''));
}
type Builtin = Date | Function | Uint8Array | string | number | undefined;
type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;