import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDialogComponent } from './global-dialog.component';
import { DialogConfigMessage } from './model/interfaces';
@Injectable()
export class GlobalDialogService {

    queue: DialogConfigMessage[] = [];
    constructor(public dialog: MatDialog) {
      this.dialog.afterAllClosed.subscribe(event => {
         if (this.queue.length){
            this.dialog.open(GlobalDialogComponent, {
               data: this.queue.shift()
            });
         }
      });
    }

    open(message: DialogConfigMessage): void {
      if (!this.dialog.openDialogs || !this.dialog.openDialogs.length){
         this.dialog.open(GlobalDialogComponent, {
            data: message
         });
      } else {
         this.queue.push(message);
      }

    }

    close(): void {
       this.dialog.closeAll();
    }
}
