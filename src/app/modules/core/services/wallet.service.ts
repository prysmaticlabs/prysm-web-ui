import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, share, shareReplay } from 'rxjs/operators';
import { EnvironmenterService } from './environmenter.service';
import {
  WalletResponse,
  GenerateMnemonicResponse,
  CreateWalletRequest,
  ListAccountsResponse,
  Account,
  ChangePasswordRequest,
  HasWalletResponse,
  ImportKeystoresRequest,
  ImportKeystoresResponse,
  BackupAccountsRequest,
  BackupAccountsResponse,
  DeleteAccountsRequest,
  DeleteAccountsResponse,
  CreateAccountsRequest,
  DepositDataResponse
} from 'src/app/proto/validator/accounts/v2/web_api';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  constructor(
    private http: HttpClient,
    private environmenter: EnvironmenterService,
  ) { }

  private apiUrl = this.environmenter.env.validatorEndpoint;

  // Observables.
  walletExists$: Observable<HasWalletResponse> = this.http.get<HasWalletResponse>(`${this.apiUrl}/wallet/exists`);
  walletConfig$: Observable<WalletResponse> = this.http.get<WalletResponse>(`${this.apiUrl}/wallet`).pipe(
    share(),
  );
  validatingPublicKeys$: Observable<string[]> = this.http.get<ListAccountsResponse>(
    `${this.apiUrl}/accounts?all=true`
  ).pipe(
    map((res: ListAccountsResponse) => res.accounts.map((acc: Account) => acc.validatingPublicKey)),
    share(),
  );

  // Retrieve a randomly generateed bip39 mnemonic from the backend,
  // ensuring it can be replayed by multiple subscribers. For example: being able
  // to verify the generated mnemonic matches the user input in a confirmation box
  // would require share replay for us to compare to the proper value.
  generateMnemonic$ = this.http.get<GenerateMnemonicResponse>(`${this.apiUrl}/mnemonic/generate`).pipe(
    map((resp: GenerateMnemonicResponse) => resp.mnemonic),
    shareReplay(1),
  );

  accounts(
    pageIndex?: number,
    pageSize?: number,
  ): Observable<ListAccountsResponse> {
    let params = `?`;
    if (pageIndex) {
      params += `pageToken=${pageIndex}&`;
    }
    if (pageSize) {
      params += `pageSize=${pageSize}`;
    }
    return this.http.get<ListAccountsResponse>(`${this.apiUrl}/accounts${params}`).pipe(
      share(),
    );
  }

  createWallet(request: CreateWalletRequest): Observable<WalletResponse> {
    return this.http.post<WalletResponse>(`${this.apiUrl}/wallet/create`, request);
  }

  changeWalletPassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/wallet/password/edit`, request);
  }

  importKeystores(request: ImportKeystoresRequest): Observable<ImportKeystoresResponse> {
    return this.http.post<ImportKeystoresResponse>(`${this.apiUrl}/wallet/keystores/import`, request);
  }

  createAccounts(request: CreateAccountsRequest): Observable<DepositDataResponse> {
    return this.http.post<DepositDataResponse>(`${this.apiUrl}/wallet/accounts/create`, request);
  }

  backupAccounts(request: BackupAccountsRequest): Observable<BackupAccountsResponse> {
    return this.http.post<BackupAccountsResponse>(`${this.apiUrl}/wallet/accounts/backup`, request);
  }

  deleteAccounts(request: DeleteAccountsRequest): Observable<DeleteAccountsResponse> {
    return this.http.post<DeleteAccountsResponse>(`${this.apiUrl}/wallet/accounts/delete`, request);
  }
}
