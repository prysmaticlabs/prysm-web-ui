import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WalletResponse {
  walletPath: string;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  token: string;
  constructor(
    private http: HttpClient,
  ) { }

  walletConfig$: Observable<WalletResponse> = this.http.get<WalletResponse>('/api/wallet');
}
