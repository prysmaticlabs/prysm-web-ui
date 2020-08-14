import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '../../../../environments/token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public token: string;
  private apiUrl: string;

  constructor(
    @Inject(ENVIRONMENT) private readonly environment: Environment,
    private router: Router,
    private http: HttpClient,
  ) {
    this.apiUrl = environment.apiEndpoint;
  }

  login() {
  }

  logout() {
  }
}
