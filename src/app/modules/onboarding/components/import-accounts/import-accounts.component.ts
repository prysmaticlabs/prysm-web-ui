import { Component, Input } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-import-accounts',
  templateUrl: './import-accounts.component.html',
})
export class ImportAccountsComponent {
  @Input() formGroup: FormGroup | null = null;

  constructor() { }

  // Properties.
  MAX_FILES_BEFORE_PREVIEW = 3;
  filesPreview: NgxFileDropEntry[] = [];
  files: NgxFileDropEntry[] = [];
  totalFiles = 0;
  numFilesUploaded = 0;
  uploading = false;

  updateImportedKeystores(jsonFile: object): void {
    const imported = this.formGroup?.get('keystoresImported')?.value;
    this.formGroup?.get('keystoresImported')?.setValue([...imported, JSON.stringify(jsonFile)]);
  }

  dropped(files: NgxFileDropEntry[]): void {
    this.files = this.files.concat(files);
    this.filesPreview = this.files.slice(0, this.MAX_FILES_BEFORE_PREVIEW);
    this.totalFiles = this.files.length;
    this.uploading = true;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file(async (file: File) => {
          const text = await file.text();
          this.numFilesUploaded++;
          if (this.numFilesUploaded === this.totalFiles) {
            this.uploading = false;
          }
          this.updateImportedKeystores(JSON.parse(text));
        });
      }
    }
  }
}
