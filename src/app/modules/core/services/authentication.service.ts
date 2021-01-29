import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { EnvironmenterService } from './environmenter.service';
import { AuthRequest, AuthResponse, ChangePasswordRequest, HasUsedWebResponse } from 'src/app/proto/validator/accounts/v2/web_api';
import { LoginComponent } from '../../auth/login/login.component';
import { SignupComponent } from '../../auth/signup/signup.component';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private http: HttpClient,
    private environmenter: EnvironmenterService,
    private dialog: MatDialog,
  ) {
  }
  hasSignedUp = false;
  shortLivedToken = '';
  private apiUrl = this.environmenter.env.validatorEndpoint;

  prompt(): MatDialogRef<LoginComponent | SignupComponent> {
    if (this.hasSignedUp) {
      return this.dialog.open(LoginComponent);
    }
    return this.dialog.open(SignupComponent);
  }

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.authenticate(`${this.apiUrl}/login`, request);
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

  // Authenticate the user with a password and extract the JWT token
  // from the response object. Uses take to prevent multiple calls to the backend.
  authenticate(method: string, request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(method, request).pipe(
      tap((res: AuthResponse) => {
        this.shortLivedToken = res.token;
      }),
    );
  }
}
