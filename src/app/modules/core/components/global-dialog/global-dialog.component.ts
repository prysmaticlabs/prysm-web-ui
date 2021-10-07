import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDialogService } from './global-dialog.service';
import { DialogConfigMessage } from './model/interfaces';
import { DialogConfigMessageActionType } from './model/types';

@Component({
    selector: 'app-global-dialog',
    templateUrl: 'global-dialog.component.html'
})
export class GlobalDialogComponent implements OnInit {
    constructor(
       
        ) { }

    ngOnInit() { 
        
    }


}
