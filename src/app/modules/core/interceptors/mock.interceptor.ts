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
    if (!this.environmenter.env.production && request.url in Mocks) {
      return of(new HttpResponse({
        status: 200,
        body: Mocks[request.url],
      }));
    }
    return next.handle(request);
  }
}
