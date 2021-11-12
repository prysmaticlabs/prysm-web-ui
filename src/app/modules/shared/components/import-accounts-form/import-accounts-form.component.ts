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

  keystores: string[] = [];

  uniqueToggleFormControl = this.formBuilder.control(false);

  ngOnInit(): void {
    this.uniqueToggleFormControl.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }
  // Unzip an uploaded zip file and attempt
  // to get all its keystores to update the form group.
  unzipFile(zipFile: File): void {
    from(JSZip.loadAsync(zipFile))
      .pipe(
        take(1),
        tap((blob: JSZip) => {
          const keystores: any =[];
          blob.forEach((item, file) => {
             //keystores[i] = await blob.file(item)?.async('string')
            blob.file(item)?.async('string').then((res)=>{
               console.log(item)
              console.log(blob)
              
              if (res) {
                console.log(res)
                this.updateImportedKeystores(item, JSON.parse(res));
              }
            });
          });

          keystores.forEach((keystore:string) => {
            console.log(JSON.parse(keystore));
          })
         
        }),
        catchError((err) => {
          return throwError(err);
        })
      )
      .subscribe();
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

  displayPubKey(keystore: {pubkey:string}): string {
    
    return '0x'+keystore.pubkey.slice(0,6);
  }

  removeKeystore(keystore:string): void {
    const keystores = this.formGroup?.get('keystoresImported')?.value as string[];
    const index = keystores.indexOf(keystore);
    if (index > -1) {
      keystores.splice(index, 1);
      this.formGroup?.get('keystoresImported')?.setValue(keystores);
    }
  }

  get keystoresImported(): FormArray {
    return this.formGroup?.controls['keystoresImported'] as FormArray ;
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
        console.log('Duplicate: ' + fileName);
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

    //this.dropzone?.uploadedFiles
    
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
