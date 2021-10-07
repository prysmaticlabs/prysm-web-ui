import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDialogComponent } from './global-dialog.component';
import { DialogConfigMessage } from './model/interfaces';
@Injectable()
export class GlobalDialogService {
    

    constructor(public dialog: MatDialog) { }

    open(message: DialogConfigMessage): void {
       this.dialog.open(GlobalDialogComponent,{
            data: message
       })
    }

    close(): void {
       this.dialog.closeAll();
    }
}