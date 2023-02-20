import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { Mocks, generateBalancesForEpoch, KeymanagerAPIMocks, RestObject} from '../mocks';
import { EnvironmenterService } from '../services/environmenter.service';

export const VALIDATOR_API_PREFIX = '/v2/validator';
export const KEYMANAGER_API_PREFIX = '/eth/v1/keystores';
export const KEYMANAGER_API_VALIDATOR_PREFIX = '/eth/v1/validator';

@Injectable()
export class MockInterceptor implements HttpInterceptor {
  constructor(
    private environmenter: EnvironmenterService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let endpoint = '';
    if (this.contains(request.url, KEYMANAGER_API_PREFIX)) {
      let mock = KeymanagerAPIMocks[KEYMANAGER_API_PREFIX];
      return of(new HttpResponse({
        status: 200,
        body: mock[request.method as keyof RestObject],
      }));
    }
    if (this.contains(request.url, KEYMANAGER_API_VALIDATOR_PREFIX )) {
      if(this.contains(request.url,'feerecipient')){
        let mock = KeymanagerAPIMocks['/eth/v1/validator/{pubkey}/feerecipient'];
        return of(new HttpResponse({
          status: 200,
          body: mock[request.method as keyof RestObject],
        }));
        // throw new HttpErrorResponse({
        //   error: "error occurred",
        //   status: 400
        // });
      }
     
    }
    if (this.contains(request.url, VALIDATOR_API_PREFIX)) {
      endpoint = this.extractEndpoint(request.url, VALIDATOR_API_PREFIX);
    }
    const balanceRequest = request.url.indexOf(`${VALIDATOR_API_PREFIX}/beacon/balances`);
    if (balanceRequest !== -1) {
      return of(new HttpResponse({
        status: 200,
        body: generateBalancesForEpoch(request.url),
      }));
    }
    if (!endpoint) {
      return next.handle(request);
    }
    return of(new HttpResponse({
      status: 200,
      body: Mocks[endpoint],
    }));
  }

  private extractEndpoint(url: string, suffix: string): string {
    const idx = url.indexOf(suffix);
    let endpoint = url.slice(idx);
    const end = endpoint.indexOf('?');
    if (end !== -1) {
      endpoint = endpoint.substring(0, end);
    }
    return endpoint;
  }

  private contains(url: string, suffix: string): boolean {
    return url.indexOf(suffix) !== -1;
  }
}
