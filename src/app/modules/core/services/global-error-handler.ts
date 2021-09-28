import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { NotificationService } from '../../shared/services/notification.service';
import { EnvironmenterService } from './environmenter.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private notificationService: NotificationService,
    private authService: AuthenticationService,
    private environmenter: EnvironmenterService,
    private router: Router
  ) { }

  handleError(error: string | Error | HttpErrorResponse): void{
    try {

      const isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
      if (typeof error === 'string'){
        console.log('type string Error');
        console.log(error);
        this.notificationService.notifyError(error);
      } else if ( error instanceof Error) {
        console.log('type Error');
        console.log(error);
        this.notificationService.notifyError(error.message);
      } else if (error instanceof HttpErrorResponse){
        this.handleHttpError(error);
      } else {
        console.log('Unknown Error');
        console.log(error);
        this.notificationService.notifyError('Unknown Error, please check the browser developer console and contact the supporting team');
      }

    } catch (e) {
      console.log('An unknown error occured, please contact the team for assistance. ');
      console.log(e);
    }
  }

  private handleHttpError(error: HttpErrorResponse): void {
    console.log('HttpErrorResponse');
    console.log(error);
    // if the HttpErrorResponse is not from our validator api
    if (error.url && error.url.indexOf(this.environmenter.env.validatorEndpoint) === -1){
      console.log('not my web api');
      this.notificationService.notifyError(error.message);
    } else {
      if (error.status === 401){
        console.log('redirecting');
        this.authService.clearCachedToken();
        this.router.navigate(['initialize']);
      } else {
        this.notificationService.notifyError(error.message);
      }
    }

  }
}
