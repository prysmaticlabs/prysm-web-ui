import { Component, Input } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { FormGroup } from '@angular/forms';
import { from, throwError } from 'rxjs';
import * as JSZip from 'jszip';
import { catchError, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-import-accounts-form',
  templateUrl: './import-accounts-form.component.html',
})
export class ImportAccountsFormComponent {
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

  // Unzip an uploaded zip file and attempt
  // to get all its keystores to update the form group.
  unzipFile(zipFile: File): void {
    from(JSZip.loadAsync(zipFile)).pipe(
      take(1),
      tap((blob: JSZip) => {
        blob.forEach(async (item) => {
          const res = await blob.file(item)?.async('string');
          if (res) {
            this.updateImportedKeystores(JSON.parse(res));
          }
        });
      }),
      catchError(err => {
        return throwError(err);
      })
    ).subscribe();
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
          if (file.type === 'application/zip') {
            this.unzipFile(file);
          } else {
            this.updateImportedKeystores(JSON.parse(text));
          }
        });
      }
    }
  }
}
