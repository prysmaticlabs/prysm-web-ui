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
  invalidFiles: string[] = [];
  filesPreview: string[] = [];
  uploading = false;

  // Unzip an uploaded zip file and attempt
  // to get all its keystores to update the form group.
  unzipFile(zipFile: File): void {
    from(JSZip.loadAsync(zipFile)).pipe(
      take(1),
      tap((blob: JSZip) => {
        blob.forEach(async (item) => {
          const res = await blob.file(item)?.async('string');
          if (res) {
            this.updateImportedKeystores(item, JSON.parse(res));
          }
        });
      }),
      catchError(err => {
        return throwError(err);
      })
    ).subscribe();
  }

  dropped(droppedFiles: NgxFileDropEntry[]): void {
    this.uploading = true;
    let numFilesUploaded = 0;
    this.invalidFiles = [];
    for (const droppedFile of droppedFiles) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file(async (file: File) => {
          const text = await file.text();
          numFilesUploaded++;
          if (numFilesUploaded ===  droppedFiles.length) {
            this.uploading = false;
          }
          if (file.type === 'application/zip') {
            this.unzipFile(file);
          } else {
            this.updateImportedKeystores(file.name, JSON.parse(text));
          }
        });
      }
    }
  }

  private updateImportedKeystores(fileName: string, jsonFile: object): void {
    if (!this.isKeystoreFileValid(jsonFile)) {
      this.invalidFiles.push('Invalid Format: ' + fileName);
      return;
    }
    
    const imported = this.formGroup?.get('keystoresImported')?.value as string[];
    const jsonString = JSON.stringify(jsonFile);
    if (imported.includes(jsonString)) {
      this.invalidFiles.push('Duplicate: ' + fileName);
      return;
    }

    this.filesPreview.push(fileName);
    this.formGroup?.get('keystoresImported')?.setValue([...imported, jsonString]);
  }

  private isKeystoreFileValid(jsonFile: object): boolean {
    // Keystores are by definition an array, so exit early.
    if (!Array.isArray(jsonFile)) {
      return false;
    }
    
    // Lazy way checking if the attributes exists.
    return (jsonFile as Array<Object>).every(item => 
        'pubkey' in item
        && 'withdrawal_credentials' in item
        && 'amount' in item
        && 'signature' in item
        && 'deposit_message_root' in item
        && 'deposit_data_root' in item
        && 'fork_version' in item
        && 'eth2_network_name' in item
        && 'deposit_cli_version' in item);
  }
}
