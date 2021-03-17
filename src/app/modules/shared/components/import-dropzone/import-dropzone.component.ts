import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-import-dropzone',
  templateUrl: './import-dropzone.component.html',
  styleUrls: ['./import-dropzone.component.scss'],
})
export class ImportDropzoneComponent implements OnInit {
  constructor() {}
  uploading = false;
  invalidFiles = [];

  @Input() accept: string | undefined;

  @Output() fileChange = new EventEmitter<{ file: File; txt: string }>();

  ngOnInit(): void {}
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
          if (numFilesUploaded === droppedFiles.length) {
            this.uploading = false;
          }
          this.fileChange.emit({
            file: (file),
            txt: (text),
          });
        });
      }
    }
  }
}
