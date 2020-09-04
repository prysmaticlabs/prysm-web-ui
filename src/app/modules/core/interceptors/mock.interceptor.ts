import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { Mocks } from '../mocks';
import { EnvironmenterService } from '../services/environmenter.service';

@Injectable()
export class MockInterceptor implements HttpInterceptor {
  constructor(
    private environmenter: EnvironmenterService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.environmenter.env.production) {
      const apiIdx = request.url.indexOf('/v2/validator/');
      if (apiIdx !== -1) {
        const endpoint = request.url.slice(apiIdx);
        return of(new HttpResponse({
          status: 200,
          body: Mocks[endpoint],
        }));
      }
    }
    return next.handle(request);
  }
}
