import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-import-dropzone',
  templateUrl: './import-dropzone.component.html',
  styleUrls: ['./import-dropzone.component.scss'],
})
export class ImportDropzoneComponent{
  constructor() {}
  uploadedFiles: File[] = [];
  uploading = false;
  invalidFiles: string[] = [];

  @Input() accept: string | undefined;

  @Input() multiple: boolean = true;

  @Output() fileChange = new EventEmitter<DropFile>();
  
  dropped(droppedFiles: NgxFileDropEntry[]): void {
    this.uploading = true;
    let numFilesUploaded = 0;
    this.invalidFiles = [];
    for (const droppedFile of droppedFiles) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          numFilesUploaded++;
          if (numFilesUploaded === droppedFiles.length) {
            this.uploading = false;
          }
          // console.log( file.text().then((txt) => {
          //   let x:{pubkey:string} = JSON.parse(txt);
          //   console.log('0x'+x.pubkey.slice(0,6))
          // }));
         
          this.fileChange.emit({
            file: (file),
            action: DropFileAction.IMPORT,
            context: this
          } as DropFile);
        });
      }
    }
  }

  removeFile(file: File): void {
    const index = this.uploadedFiles.findIndex(f => f.name === file.name);
    if (index >= 0) {
      this.uploadedFiles.splice(index, 1);
      this.fileChange.emit({
        file: (file),
        action: DropFileAction.DELETE,
        context: this
      } as DropFile);
    }
  }


  pushValidationResult({file,responses}:{file: File, responses: string[]}): void {
    this.invalidFiles = responses;
    if (responses.length === 0) {
      this.uploadedFiles.push(file);
    }
  }
}

export interface DropFile {
  file: File;
  action: DropFileAction
  context: ImportDropzoneComponent;
}

export enum DropFileAction {
  IMPORT,
  DELETE
}
