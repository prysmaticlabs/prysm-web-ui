import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthRequest {
  password: string;
}

export interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
  }
  token: string;

  login(password: string): Observable<AuthResponse> {
    return this.authenticate('/api/login', password);
  }

  signup(password: string): Observable<AuthResponse> {
    return this.authenticate('/api/signup', password);
  }

  // Authenticate the user with a password and extract the JWT token
  // from the response object. Uses take to prevent multiple calls to the backend.
  authenticate(method: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(method, { password } as AuthRequest).pipe(
      take(1),
      tap((res: any) => {
        this.token = res.token;
      }),
    );
  }

  // Logout the user and navigate to the application root.
  logout() {
    this.token = '';
    this.router.navigateByUrl('/');
  }
}
