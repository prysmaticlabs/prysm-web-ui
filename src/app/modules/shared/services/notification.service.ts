import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  notifySuccess(msg: string, duration = 4000): void {
    this.snackBar.open(msg, 'Success', this.snackConfig(duration));
  }

  notifyError(msg: string, duration = 4000): void {
    this.snackBar.open(msg, 'Error', this.snackConfig(duration));
  }

  notifyWithComponent(component: ComponentType<any>, duration = 4000): void {
    this.snackBar.openFromComponent(component, this.snackConfig(duration));
  }

  private snackConfig(duration = 4000): MatSnackBarConfig<any> {
    return {
      duration: (duration),
      horizontalPosition: 'right',
      verticalPosition: 'top',
      politeness: 'polite',
    };
  }
}
