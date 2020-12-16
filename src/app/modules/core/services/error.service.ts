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

  handleHTTPError(err: HttpErrorResponse): void {
    this.zone.run(() => {
      this.snackBar.open(err.error?.message || err.message, 'Close', {
        duration: 4000,
        panelClass: 'snackbar-warn',
      });
    });
  }
}
