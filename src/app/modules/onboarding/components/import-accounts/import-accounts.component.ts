import { Component, Output, EventEmitter } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-import-accounts',
  templateUrl: './import-accounts.component.html',
})
export class ImportAccountsComponent {
  @Output() keystoreUploaded = new EventEmitter<Uint8Array>();

  constructor() { }

  // Properties.
  filesPreview: NgxFileDropEntry[];

  dropped(files: NgxFileDropEntry[]) {
    this.filesPreview = files.slice(0, 5);
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file(async (file: File) => {
          const buffer = await file.arrayBuffer();
          const ui8 = new Uint8Array(buffer);
          this.keystoreUploaded.emit(ui8);
        });
      }
    }
  }
}
