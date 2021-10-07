import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDialogComponent } from './global-dialog.component';
import { DialogConfigMessage } from './model/interfaces';
import { DialogConfigMessageActionType } from './model/types';
@Injectable()
export class GlobalDialogService {
    

    constructor(public dialog: MatDialog) { }

    open(): void {
       this.dialog.open(GlobalDialogComponent)
    }

    close(): void {
       
    }
}