import { Component, Output, EventEmitter, Input } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-import-accounts',
  templateUrl: './import-accounts.component.html',
})
export class ImportAccountsComponent {
  @Input() formGroup: FormGroup;
  @Output() keystoreUploaded = new EventEmitter<Uint8Array>();

  constructor() { }

  // Properties.
  filesPreview: NgxFileDropEntry[];
  files: NgxFileDropEntry[] = [];
  totalFiles: number;
  numFilesUploaded: number = 0;
  uploading = false;

  dropped(files: NgxFileDropEntry[]) {
    this.files = this.files.concat(files);
    this.filesPreview = this.files.slice(0, 3);
    this.totalFiles = this.files.length;
    this.uploading = true;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file(async (file: File) => {
          const buffer = await file.arrayBuffer();
          const ui8 = new Uint8Array(buffer);
          this.numFilesUploaded++;
          if (this.numFilesUploaded === this.totalFiles) {
            this.uploading = false;
          }
          this.keystoreUploaded.emit(ui8);
        });
      }
    }
  }
}
