import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../../auth/services/authentication.service';
import { EnvironmenterService } from '../services/environmenter.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private environmenterService: EnvironmenterService
    ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add authorization header to all HTTP requests with
    // a jwt token if available from the auth service..
    const token = this.authenticationService.getToken();
    if ((token && request.url.indexOf(this.environmenterService.env.validatorEndpoint) !== -1) ||
    (token && request.url.indexOf(this.environmenterService.env.keymanagerEndpoint) !== -1))
    {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}
