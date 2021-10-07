import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogConfig, DialogConfigMessage, DialogContentAlert } from './model/interfaces';

@Component({
    selector: 'app-global-dialog',
    templateUrl: 'global-dialog.component.html'
})
export class GlobalDialogComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data:DialogConfigMessage) { }

    title: string = '';
    content: string = '';

    alert: DialogContentAlert | null | undefined = null;

    ngOnInit() { 
        const dialogConfig: DialogConfig = this.data.payload;
        this.title = dialogConfig.title;
        this.content = dialogConfig.content;
        this.alert = dialogConfig.alert;

        console.log(dialogConfig.alert);
    }

    isInstanceOfError():boolean {
        if(this.alert){
            return this.alert.message instanceof Error || this.alert.message instanceof HttpErrorResponse;
        }
        return false;
    }


}
