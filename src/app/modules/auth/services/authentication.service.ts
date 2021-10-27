import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthRequest, AuthResponse, ChangePasswordRequest, HasUsedWebResponse } from 'src/app/proto/validator/accounts/v2/web_api';
import { EnvironmenterService } from '../../core/services/environmenter.service';



@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private http: HttpClient,
    private environmenter: EnvironmenterService
  ) {
  }
  hasSignedUp = false;
  shortLivedToken = '';
  private apiUrl = this.environmenter.env.validatorEndpoint;

  private TOKENNAME = 'prysm_access_token';
  private TOKENEXPIRATIONNAME = 'prysm_access_token_expiration';

  cacheToken(token: string, tokenExpiration: number): void{
    this.clearCachedToken();
    window.localStorage.setItem(this.TOKENNAME, token);
    if (tokenExpiration){
      window.localStorage.setItem(this.TOKENEXPIRATIONNAME, tokenExpiration.toString());
    }
  }

  clearCachedToken(): void{
    window.localStorage.removeItem(this.TOKENNAME);
    window.localStorage.removeItem(this.TOKENEXPIRATIONNAME);
  }

  checkHasUsedWeb(): Observable<HasUsedWebResponse> {
    return this.http.get<HasUsedWebResponse>(`${this.apiUrl}/initialize`).pipe(
      tap((res: HasUsedWebResponse) => this.hasSignedUp = res.hasSignedUp),
    );
  }

  getToken(): string | null{
    return window.localStorage.getItem(this.TOKENNAME);
  }

  getTokenExpiration(): number | null {
    const tokenExpiration = window.localStorage.getItem(this.TOKENEXPIRATIONNAME);
    return Number(tokenExpiration);
  }

}
