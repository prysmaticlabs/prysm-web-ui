import { HttpErrorResponse } from '@angular/common/http';
import { DialogContentAlertType } from './types';

export interface DialogConfigMessage {
    payload: DialogConfig;
}

export interface DialogConfig {
    title: string;
    content: string;
    alert?: DialogContentAlert;
}

export interface DialogContentAlert {
    type: DialogContentAlertType;
    title: string;
    description: string;
    message: string | Error | HttpErrorResponse;
}
