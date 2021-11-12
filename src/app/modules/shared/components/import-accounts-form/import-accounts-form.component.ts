import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as JSZip from 'jszip';
import { from, throwError } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { DropFile, ImportDropzoneComponent } from '../import-dropzone/import-dropzone.component';

@Component({
  selector: 'app-import-accounts-form',
  templateUrl: './import-accounts-form.component.html',
})
export class ImportAccountsFormComponent implements OnInit {
  @Input() formGroup: FormGroup | null = null;
  @ViewChild('dropzone') dropzone: ImportDropzoneComponent | undefined;

  constructor(private formBuilder: FormBuilder) {}

  uniqueToggleFormControl = this.formBuilder.control(false);

  get keystoresImported(): FormArray {
    return this.formGroup?.controls['keystoresImported'] as FormArray ;
  }

  ngOnInit(): void {
    this.uniqueToggleFormControl.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }

  fileChangeHandler(obj: DropFile): void {
    if (obj.file.type === 'application/zip') {
      this.unzipFile(obj.file);
    } else {
      obj.file.text().then((txt) => {
        this.updateImportedKeystores(obj.file.name, JSON.parse(txt));
      });
      
    }
  }

  // Unzip an uploaded zip file and attempt
  // to get all its keystores to update the form group.
  unzipFile(zipFile: File): void {
    from(JSZip.loadAsync(zipFile))
      .pipe(
        take(1),
        tap((blob: JSZip) => {
          blob.forEach((item) => {
            const file = blob.file(item);
            if(file){
              file.async('string').then((txt) => {
                try {
                this.updateImportedKeystores(item, JSON.parse(txt));
                } catch(err){
                  // sometimes zip contains extra info that processes like a file
                  // do nothing for parsing errors, will be validated for correct json in function
                }
              });
            } else {
              this.dropzone?.addInvalidFileReason('Error Reading File:'+item);
            }
          });
        }),
        catchError((err) => {
          return throwError(err);
        })
      )
      .subscribe();
  }

  private displayPubKey(keystore: {pubkey:string}): string {
    return '0x'+keystore.pubkey.slice(0,6);
  }

  removeKeystores(): void {
    this.keystoresImported.controls = this.keystoresImported.controls.filter((fg) => {
      const selected = fg.get('isSelected')?.value;
      if(selected){
        // remove from imported dropzone
        this.dropzone?.removeFile(fg.get('keystore')?.value);
      }
      // keep the form groups that are not selected
      return !selected;
    });
  }

  private updateImportedKeystores(fileName: string, jsonFile: {pubkey:string}): void {
    if (!this.isKeystoreFileValid(jsonFile)) {
      this.dropzone?.addInvalidFileReason('Invalid Format: ' + fileName);
      return;
    }
    if(this.keystoresImported.controls.length > 0){
      const imported = this.keystoresImported.controls.map((fg) => JSON.stringify(fg.get('keystore')?.value));
      const jsonString = JSON.stringify(jsonFile);
      if (imported.includes(jsonString)) {
        this.dropzone?.addInvalidFileReason('Duplicate: ' + fileName);
        return;
      }
    }
    
    const keystoresFormGroup : FormGroup = this.formBuilder.group({
      pubkeyShort: this.displayPubKey(jsonFile),
      isSelected:[false],
      keystore: [jsonFile],
      keystorePassword: ['', Validators.required],
    });
    
    this.keystoresImported?.push(keystoresFormGroup);
    
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
