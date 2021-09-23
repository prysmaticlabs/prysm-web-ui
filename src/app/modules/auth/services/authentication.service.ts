import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { EnvironmenterService } from '../../core/services/environmenter.service';
import { AuthRequest, AuthResponse, ChangePasswordRequest, HasUsedWebResponse } from 'src/app/proto/validator/accounts/v2/web_api';

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

  private accessToken: string = '';
  private accessTokenExpiration: number = 0;

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.authenticate(`${this.apiUrl}/login`, request);
  }
  
  loginWithToken(token: string): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, token).pipe(
      tap((res: AuthResponse) => {
        if(res){
          this.accessToken = res.token;
          this.accessTokenExpiration = res.tokenExpiration;
          window.localStorage.setItem(this.TOKENNAME, res.token);
          window.localStorage.setItem(this.TOKENEXPIRATIONNAME, res.tokenExpiration.toString());
        }
      })
    );
  }

  signup(request: AuthRequest): Observable<AuthResponse> {
    return this.authenticate(`${this.apiUrl}/signup`, request);
  }

  changeUIPassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/password/edit`, request);
  }

  checkHasUsedWeb(): Observable<HasUsedWebResponse> {
    return this.http.get<HasUsedWebResponse>(`${this.apiUrl}/initialized`).pipe(
      tap((res: HasUsedWebResponse) => this.hasSignedUp = res.hasSignedUp),
    );
  }

  getToken(): string | null{
    return window.localStorage.getItem(this.TOKENNAME) ?? (this.accessToken !== ''? this.accessToken: null);
  }

  getTokenExpiration(): number | null {
    let tokenExpiration = window.localStorage.getItem(this.TOKENEXPIRATIONNAME);
    return tokenExpiration ? Number(tokenExpiration) : (this.accessTokenExpiration !== 0? this.accessTokenExpiration: null);
  }

  // Authenticate the user with a password and extract the JWT token
  // from the response object. Uses take to prevent multiple calls to the backend.
  authenticate(method: string, request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(method, request).pipe(
      tap((res: AuthResponse) => {
        this.shortLivedToken = res.token;
      })
    );
  }
}
