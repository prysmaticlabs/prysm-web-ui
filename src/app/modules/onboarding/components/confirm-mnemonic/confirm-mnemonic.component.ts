import { Component, OnInit, Input, NgZone, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { tap, take } from 'rxjs/operators';

@Component({
  selector: 'app-confirm-mnemonic',
  templateUrl: './confirm-mnemonic.component.html',
  styles: [
  ]
})
export class ConfirmMnemonicComponent {
  @Input() formGroup: FormGroup
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  constructor(
    private _ngZone: NgZone,
  ) { }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(
      tap(() => this.autosize.resizeToFitContent(true)),
      take(1),
    ).subscribe();
  }
}
