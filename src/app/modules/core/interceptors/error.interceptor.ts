import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import { ErrorService } from '../services/error.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private errorService: ErrorService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((err: HttpErrorResponse) => {
      this.errorService.handleHTTPError(err);
      if (err.status === 401) {
        // Auto logout if a 401 response (Unauthorized) is returned from the api.
        this.authenticationService.clearCredentials();
        this.router.navigate(['/login'],  {
          queryParams: {
            returnUrl: this.router.url
          }
        });
      }
      return throwError(err);
    }));
  }
}
