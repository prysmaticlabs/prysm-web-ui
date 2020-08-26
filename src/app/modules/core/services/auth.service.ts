import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
  }
  token: string;

  login(password: string) {
    return this.http.post(`/api/login`, { password }).pipe(
      tap((res: any) => {
        this.token = res.token;
      })
    );
  }

  signup(password: string) {
    return this.http.post(`/api/signup`, { password }).pipe(
      tap((res: any) => {
        this.token = res.token;
      })
    );
  }

  logout() {
  }
}
