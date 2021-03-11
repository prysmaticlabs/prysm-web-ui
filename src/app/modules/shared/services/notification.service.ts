import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  notifySuccess(msg: string, duration = 4000): void {
    this.snackBar.open(msg, 'Success', {
      duration: (duration),
      horizontalPosition: 'right',
      verticalPosition: 'top',
      politeness: 'polite',
    });
  }

  notifyWithComponent(component: ComponentType<any>, duration = 4000): void {
    this.snackBar.openFromComponent(component, {
      duration: (duration),
      horizontalPosition: 'right',
      verticalPosition: 'top',
      politeness: 'polite',
    });
  }
}
