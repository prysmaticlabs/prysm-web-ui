import { DialogConfigMessageActionType, DialogContentAlertType } from './types';

export interface DialogConfigMessage {
    action: DialogConfigMessageActionType;
    payload?: string | DialogConfig;
};

export interface DialogConfig {
    title: string;
    content: string;
    alert?: DialogContentAlert;
};

export interface DialogContentAlert {
    type: DialogContentAlertType;
    message: string;
}