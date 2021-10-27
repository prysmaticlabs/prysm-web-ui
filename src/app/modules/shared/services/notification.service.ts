import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  private readonly DURATION = 6000;

  notifySuccess(msg: string, duration = this.DURATION): void {
    this.snackBar.open(msg, 'Success', this.getSnackBarConfig(duration));
  }

  notifyError(msg: string, duration = this.DURATION): void {
    this.snackBar.open(msg, 'Close', {
      duration: this.DURATION,
      panelClass: 'snackbar-warn',
    });
  }

  notifyWithComponent(component: ComponentType<any>, duration = this.DURATION): void {
    this.snackBar.openFromComponent(
      component,
      this.getSnackBarConfig(duration)
    );
  }

  getSnackBarConfig(duration: number): MatSnackBarConfig<any> {
    return {
      duration: (duration),
      horizontalPosition: 'right',
      verticalPosition: 'top',
      politeness: 'polite'
    };
  }
}
