import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private http: HttpClient,
  ) {
  }
  token: string;

  login(password: string) {
    return this.authenticate('/api/login', password);
  }

  signup(password: string) {
    return this.authenticate('/api/signup', password);
  }

  authenticate(method: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(method, { password }).pipe(
      take(1),
      tap((res: any) => {
        this.token = res.token;
      }),
    );
  }

  logout() {
  }
}
