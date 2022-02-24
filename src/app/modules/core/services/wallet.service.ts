import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, share, shareReplay } from 'rxjs/operators';
import {
  Account, CreateWalletRequest, CreateWalletResponse, GenerateMnemonicResponse, ImportKeystoresRequest,
  ImportKeystoresResponse, ListAccountsResponse, ValidateKeystoresRequest, WalletResponse
} from 'src/app/proto/validator/accounts/v2/web_api';
import {
  AccountVoluntaryExitRequest,
  BackupAccountsRequest,
  BackupAccountsResponse,
  ImportSlashingProtectionRequest, RecoverWalletRequest
} from '../../../proto/validator/accounts/v2/web_api';
import {
  DeleteAccountsRequest, DeleteAccountsResponse,
} from '../../../proto/validator/accounts/v2/web_api_keymanager-api';
import { EnvironmenterService } from './environmenter.service';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  constructor(
    private http: HttpClient,
    private environmenter: EnvironmenterService
  ) {}

  private apiUrl = this.environmenter.env.validatorEndpoint;
  private keymanagerApiUrl = this.environmenter.env.keymanagerEndpoint;

  // Observables.
  walletConfig$: Observable<WalletResponse> = this.http
    .get<WalletResponse>(`${this.apiUrl}/wallet`)
    .pipe(share());
  validatingPublicKeys$: Observable<
    string[]
  > = this.http
    .get<ListAccountsResponse>(`${this.apiUrl}/accounts?all=true`)
    .pipe(
      map((res: ListAccountsResponse) =>
        res.accounts.map((acc: Account) => acc.validating_public_key)
      ),
      share()
    );

  // Retrieve a randomly generateed bip39 mnemonic from the backend,
  // ensuring it can be replayed by multiple subscribers. For example: being able
  // to verify the generated mnemonic matches the user input in a confirmation box
  // would require share replay for us to compare to the proper value.
  generateMnemonic$ = this.http
    .get<GenerateMnemonicResponse>(`${this.apiUrl}/mnemonic/generate`)
    .pipe(
      map((resp: GenerateMnemonicResponse) => resp.mnemonic),
      shareReplay(1)
    );

  accounts(
    pageIndex?: number,
    pageSize?: number
  ): Observable<ListAccountsResponse> {
    let params = `?`;
    if (pageIndex) {
      params += `pageToken=${pageIndex}&`;
    }
    if (pageSize) {
      params += `pageSize=${pageSize}`;
    }
    return this.http
      .get<ListAccountsResponse>(`${this.apiUrl}/accounts${params}`)
      .pipe(share());
  }

  createWallet(request: CreateWalletRequest): Observable<CreateWalletResponse> {
    return this.http.post<CreateWalletResponse>(
      `${this.apiUrl}/wallet/create`,
      request
    );
  }

  importKeystores(
    request: ImportKeystoresRequest
  ): Observable<ImportKeystoresResponse> {
    return this.http.post<ImportKeystoresResponse>(
      `${this.apiUrl}/wallet/keystores/import`,
      request
    );
  }

  validateKeystores(request: ValidateKeystoresRequest): Observable<object> {
    return this.http.post<object>(
      `${this.apiUrl}/wallet/keystores/validate`,
      request
    );
  }
  recover(request: RecoverWalletRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/wallet/recover`, request);
  }

  exitAccounts(request: AccountVoluntaryExitRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/accounts/voluntary-exit`, request);
  }

  deleteAccounts(request: DeleteAccountsRequest): Observable<DeleteAccountsResponse> {
    let httpOption = {
        body: request
    }
    return this.http.delete<DeleteAccountsResponse>(`${this.keymanagerApiUrl}`, httpOption);
  }

  importSlashingProtection(
    request: ImportSlashingProtectionRequest
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/slashing-protection/import`, request);
  }

  backUpAccounts(
    request: BackupAccountsRequest
  ): Observable<BackupAccountsResponse> {
    return this.http.post<BackupAccountsResponse>(
      `${this.apiUrl}/accounts/backup`,
      request
    );
  }
}
