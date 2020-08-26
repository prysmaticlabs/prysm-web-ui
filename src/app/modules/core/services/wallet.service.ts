import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface WalletResponse {
  walletPath: string;
}

export interface GenerateMnemonicResponse {
  mnemonic: string;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  token: string;
  constructor(
    private http: HttpClient,
  ) { }

  walletConfig$ = this.http.get<WalletResponse>('/api/wallet');
  generateMnemonic$ = this.http.get<GenerateMnemonicResponse>('/api/mnemonic/generate').pipe(
    map((resp: GenerateMnemonicResponse) => resp.mnemonic),
    catchError(err => throwError(err)),
  );
}
