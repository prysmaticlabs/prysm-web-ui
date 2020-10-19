import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { EnvironmenterService } from './environmenter.service';
import { AuthRequest, AuthResponse } from 'src/app/proto/validator/accounts/v2/web_api';

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
  private apiUrl = this.environmenter.env.validatorEndpoint;

  login(password: string): Observable<AuthResponse> {
    return this.authenticate(`${this.apiUrl}/login`, password, '');
  }

  signup(password: string, walletDir: string): Observable<AuthResponse> {
    return this.authenticate(`${this.apiUrl}/signup`, password, walletDir);
  }

  // Authenticate the user with a password and extract the JWT token
  // from the response object. Uses take to prevent multiple calls to the backend.
  authenticate(method: string, password: string, walletDir: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(method, { password, walletDir } as AuthRequest).pipe(
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
