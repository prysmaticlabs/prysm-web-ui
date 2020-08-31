import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(
    private zone: NgZone,
    private snackBar: MatSnackBar,
  ) { }

  handleHTTPError(err: HttpErrorResponse) {
    let formattedError: string;
    if (err.status >= 500) {
      switch (err.status) {
        case 502:
          formattedError = 'Bad gateway, cannot connect to server';
          break;
        case 503:
          formattedError = 'Server unavailable, cannot connect to server';
          break;
        case 504:
          formattedError = 'Operation timed out, perhaps the server is down';
          break;
        default:
          formattedError = 'Internal server error, something went wrong';
          break;
      }
    } else if (err.status >= 400 && err.status < 500) {
      switch (err.status) {
        case 400:
          formattedError = 'Bad request sent to server, something went wrong';
          break;
        case 401:
          formattedError = 'Unauthorized, you cannot access the requested resource';
          break;
        case 403:
          formattedError = 'Forbidden, the requested resource cannot be accessed';
          break;
        case 404:
          formattedError = 'Not found, could not find the requested resource in the server';
          break;
        case 405:
          formattedError = 'HTTP method not allowed';
          break;
        default:
          formattedError = 'Oops, something went wrong, please try again';
          break;
      }
    } else if (err.status >= 300 && err.status < 400) {
        switch (err.status) {
          case 301:
            formattedError = 'Requested URL has moved permamently';
            break;
          default:
            formattedError = 'Oops, something went wrong, please try again';
            break;
        }
    } else {
      formattedError = err.message;
    }
    this.zone.run(() => {
      this.snackBar.open(formattedError, 'Close', {
        duration: 4000,
      });
    });
  }
}
