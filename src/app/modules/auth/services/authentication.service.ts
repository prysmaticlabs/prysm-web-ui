import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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


  login(request: AuthRequest): Observable<AuthResponse> {
    return this.authenticate(`${this.apiUrl}/login`, request);
  }

  cacheToken(token: string, tokenExpiration: number): void{
    this.clearCachedToken();
    window.localStorage.setItem(this.TOKENNAME, token);
    window.localStorage.setItem(this.TOKENEXPIRATIONNAME, tokenExpiration.toString());
  }

  clearCachedToken(): void{
    window.localStorage.removeItem(this.TOKENNAME);
    window.localStorage.removeItem(this.TOKENEXPIRATIONNAME);
  }

  signup(request: AuthRequest): Observable<AuthResponse> {
    return this.authenticate(`${this.apiUrl}/signup`, request);
  }

  changeUIPassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/password/edit`, request);
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
