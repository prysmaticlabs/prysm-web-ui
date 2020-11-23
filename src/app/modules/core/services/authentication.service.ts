import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { EnvironmenterService } from './environmenter.service';
import { AuthRequest, AuthResponse, ChangePasswordRequest, HasUsedWeb } from 'src/app/proto/validator/accounts/v2/web_api';

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
  token = '';
  hasSignedUp = false;
  private apiUrl = this.environmenter.env.validatorEndpoint;

  login(password: string): Observable<AuthResponse> {
    return this.authenticate(`${this.apiUrl}/login`, password);
  }

  signup(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, request);
  }

  changeUIPassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/password/edit`, request);
  }

  checkHasUsedWeb(): Observable<HasUsedWeb> {
    return this.http.get<HasUsedWeb>(`${this.apiUrl}/initialized`).pipe(
      tap((res: HasUsedWeb) => this.hasSignedUp = res.hasSignedUp),
    );
  }

  // Authenticate the user with a password and extract the JWT token
  // from the response object. Uses take to prevent multiple calls to the backend.
  authenticate(method: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(method, { password } as AuthRequest).pipe(
      tap((res: AuthResponse) => {
        this.token = res.token;
      }),
    );
  }

  // Logout the user and navigate to the application root.
  logout(): void {
    this.token = '';
    this.http.post<unknown>(`${this.apiUrl}/logout`, null).pipe(
      tap(() => {
        this.router.navigateByUrl('/');
      }),
      switchMap(_ => EMPTY),
    );
  }
}
