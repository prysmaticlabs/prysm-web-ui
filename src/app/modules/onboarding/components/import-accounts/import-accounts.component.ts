import { Component, Input } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-import-accounts',
  templateUrl: './import-accounts.component.html',
})
export class ImportAccountsComponent {
  @Input() formGroup: FormGroup;

  constructor() { }

  // Properties.
  MAX_FILES_BEFORE_PREVIEW = 3;
  filesPreview: NgxFileDropEntry[];
  files: NgxFileDropEntry[] = [];
  totalFiles: number;
  numFilesUploaded: number = 0;
  uploading = false;

  updateImportedKeystores(ui8: Uint8Array) {
    const imported = this.formGroup.get('keystoresImported').value;
    this.formGroup.get('keystoresImported').setValue([...imported, ui8]);
  }

  dropped(files: NgxFileDropEntry[]) {
    this.files = this.files.concat(files);
    this.filesPreview = this.files.slice(0, this.MAX_FILES_BEFORE_PREVIEW);
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
          this.updateImportedKeystores(ui8);
        });
      }
    }
  }
}
