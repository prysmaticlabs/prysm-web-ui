import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { map, catchError, shareReplay, take } from 'rxjs/operators';

export interface WalletResponse {
  walletPath: string;
}

export interface GenerateMnemonicResponse {
  mnemonic: string;
}

export enum KeymanagerKind {
  Derived,
  Direct,
  Remote,
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

export interface CreateWalletRequest {
  keymanager: KeymanagerKind,
  walletPassword: string;
  keystoresPassword?: string;
  mnemonic?: string;
  numAccounts?: number;
  keystoresImported?: Uint8Array[];
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  constructor(
    private http: HttpClient,
  ) { }

  // Observables.
  walletConfig$ = this.http.get<WalletResponse>('/api/wallet');
  accounts$ = this.http.get<ListAccountsResponse>('/api/accounts');
  // Retrieve a randomly generateed bip39 mnemonic from the backend,
  // ensuring it can be replayed by multiple subscribers. For example: being able
  // to verify the generated mnemonic matches the user input in a confirmation box
  // would require share replay for us to compare to the proper value.
  generateMnemonic$ = this.http.get<GenerateMnemonicResponse>('/api/mnemonic/generate').pipe(
    map((resp: GenerateMnemonicResponse) => resp.mnemonic),
    shareReplay(1),
  );

  createWallet(request: CreateWalletRequest): Observable<WalletResponse> {
    return this.http.post<WalletResponse>('/api/wallet/create', request).pipe();
  }
}
