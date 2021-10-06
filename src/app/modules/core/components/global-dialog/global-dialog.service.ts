import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable()
export class GlobalDialogService {
    dialogConfigMessage$ = new Subject();

    constructor() { }

    open(): void {

    }

    close(): void {

    }
}