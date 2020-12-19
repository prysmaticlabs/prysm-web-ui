import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { EnvironmenterService } from './environmenter.service';
import { AuthRequest, AuthResponse, ChangePasswordRequest, HasUsedWebResponse } from 'src/app/proto/validator/accounts/v2/web_api';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private environmenter: EnvironmenterService,
  ) {
  }
  hasSignedUp = false;
  private apiUrl = this.environmenter.env.validatorEndpoint;

  get token(): string | null {
    return sessionStorage.getItem('token');
  }

  login(password: string): Observable<AuthResponse> {
    return this.authenticate(`${this.apiUrl}/login`, password);
  }

  signup(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, request).pipe(
      tap((res: AuthResponse) => {
        sessionStorage.setItem('token', res.token);
      }),
    );
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
  authenticate(method: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(method, { password } as AuthRequest).pipe(
      tap((res: AuthResponse) => {
        sessionStorage.setItem('token', res.token);
      }),
    );
  }

  // Logout the user and navigate to the application root.
  logout(): void {
    this.clearCredentials();
    this.http.post<unknown>(`${this.apiUrl}/logout`, null).pipe(
      tap(() => {
        this.router.navigateByUrl('/');
      }),
      switchMap(_ => EMPTY),
    );
  }

  clearCredentials(): void {
    sessionStorage.clear();
  }
}
