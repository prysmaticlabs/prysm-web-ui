import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { NotificationService } from '../../shared/services/notification.service';
import { GlobalDialogService } from '../components/global-dialog/global-dialog.service';
import { EnvironmenterService } from './environmenter.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private notificationService: NotificationService,
    private authService: AuthenticationService,
    private environmenter: EnvironmenterService,
    private globalDialogService: GlobalDialogService,
    private router: Router
  ) { }

  handleError(error: string | Error | HttpErrorResponse): void{
    try {
      if (typeof error === 'string'){
        console.log('Threw type string Error', error);
        this.notificationService.notifyError(error);
      } else if (error instanceof HttpErrorResponse){
        this.handleHttpError(error);
      } else if ( error instanceof Error) {
        console.log('Threw type Error', error);
        this.notificationService.notifyError(error.message);
      } else {
        console.log('Threw unknown Error', error);
        this.notificationService.notifyError('Unknown Error, review browser console');
      }
    } catch (e) {
      console.log('An unknown error occured, please contact the team for assistance. ');
      console.log(e);
    }
  }

  private handleHttpError(error: HttpErrorResponse): void {
    console.log('threw HttpErrorResponse ');
    // if the HttpErrorResponse is not from our validator api
    const isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
    if (error.url && error.url.indexOf(this.environmenter.env.validatorEndpoint) === -1){
      console.log('External API url:', error);
      this.notificationService.notifyError('External API error, review browser console');
    } else {
      if (error.status === 401 || (isIEOrEdge && error.status===0) ){
        this.cleanUpAuthCacheAndRedirect();
      } else if(error.status >= 400 && error.status < 600 || error.status===0){
        console.log('Network or System Error...', error);
        this.globalDialogService.open();
      } else {
        console.log('Internal API url: ', error);
        this.notificationService.notifyError('Internal API error, review browser console');
      }
    }

  }

  private cleanUpAuthCacheAndRedirect(): void{
    console.log('Unauthorized ... redirecting...');
    this.authService.clearCachedToken();
    this.router.navigate(['initialize']);
  }
}
