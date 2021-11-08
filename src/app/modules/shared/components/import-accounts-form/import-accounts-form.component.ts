import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as JSZip from 'jszip';
import { from, throwError } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { DropFile } from '../import-dropzone/import-dropzone.component';

@Component({
  selector: 'app-import-accounts-form',
  templateUrl: './import-accounts-form.component.html',
})
export class ImportAccountsFormComponent {
  @Input() formGroup: FormGroup | null = null;
  
  constructor() {}

  // Properties.
  invalidFiles: string[] = [];

  

  // Unzip an uploaded zip file and attempt
  // to get all its keystores to update the form group.
  unzipFile(zipFile: File): void {
    from(JSZip.loadAsync(zipFile))
      .pipe(
        take(1),
        tap((blob: JSZip) => {
          blob.forEach(async (item) => {
            const res = await blob.file(item)?.async('string');
            if (res) {
              this.updateImportedKeystores(item, JSON.parse(res));
            }
          });
        }),
        catchError((err) => {
          return throwError(err);
        })
      )
      .subscribe();
  }

  fileChangeHandler(obj: DropFile): void {
    const { file, context } = obj;
    if (file.type === 'application/zip') {
      this.unzipFile(file);
      
      context.pushValidationResult({file: file, responses: this.invalidFiles});
    } else {
      file.text().then((txt) => {
        this.updateImportedKeystores(file.name, JSON.parse(txt));
        context.pushValidationResult({file: file, responses: this.invalidFiles});
      });
      
    }
  }

  private updateImportedKeystores(fileName: string, jsonFile: object): void {
    
    if (!this.isKeystoreFileValid(jsonFile)) {
      this.invalidFiles.push('Invalid Format: ' + fileName);
      return;
    }

    const imported = this.formGroup?.get('keystoresImported')
      ?.value as string[];
    const jsonString = JSON.stringify(jsonFile);
    if (imported.includes(jsonString)) {
      this.invalidFiles.push('Duplicate: ' + fileName);
      return;
    }
    this.formGroup
      ?.get('keystoresImported')
      ?.setValue([...imported, jsonString]);
  }

  private isKeystoreFileValid(jsonFile: object): boolean {
    // Lazy way checking if the attributes exists.
    return (
      'crypto' in jsonFile &&
      'pubkey' in jsonFile &&
      'uuid' in jsonFile &&
      'version' in jsonFile
    );
  }
}
