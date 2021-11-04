import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-import-dropzone',
  templateUrl: './import-dropzone.component.html',
  styleUrls: ['./import-dropzone.component.scss'],
})
export class ImportDropzoneComponent{
  constructor() {}
  MAX_FILES_BEFORE_PREVIEW = 3;
  filesPreview: string[] = [];
  uploading = false;
  invalidFiles: any[] = [];

  @Input() accept: string | undefined;
  @Output() fileChange = new EventEmitter<{
    file: File;
    context: any;
    validationResult: (context: any, file: File, ...responses: any[]) => void;
  }>();
  
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
          this.fileChange.emit({
            file: (file),
            context: this,
            validationResult: this.onValidationResult,
          } as DropFile);
        });
      }
    }
  }

  private onValidationResult(ctx: any, file: File, responses: any[]): void {
    ctx.invalidFiles = responses;
    if (responses.length === 0) {
      ctx.filesPreview.push(file.name);
    }
  }
}

export interface DropFile {
  file: File;
  context: ImportDropzoneComponent;
  validationResult: (context: ImportDropzoneComponent, file: File, ...responses: any[]) => void;
}
