import { Component, OnInit, Input, NgZone, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirm-mnemonic',
  templateUrl: './confirm-mnemonic.component.html',
})
export class ConfirmMnemonicComponent implements OnInit, OnDestroy {
  @Input() formGroup: FormGroup
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  destroyed$$ = new Subject<void>();

  constructor(
    private _ngZone: NgZone,
  ) { }

  ngOnInit(): void {
    this.triggerResize();
  }

  ngOnDestroy(): void {
    this.destroyed$$.next();
    this.destroyed$$.complete();
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(
      tap(() => this.autosize.resizeToFitContent(true)),
      takeUntil(this.destroyed$$),
    ).subscribe();
  }
}
