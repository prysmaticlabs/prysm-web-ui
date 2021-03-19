import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  notifySuccess(msg: string, duration = 4000): void {
    this.snackBar.open(msg, 'Success', this.getSnackBarConfig(duration));
  }

  notifyError(msg: string, duration = 4000): void {
    this.snackBar.open(msg, 'Error', this.getSnackBarConfig(duration));
  }

  notifyWithComponent(component: ComponentType<any>, duration = 4000): void {
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
      politeness: 'polite',
    };
  }
}
