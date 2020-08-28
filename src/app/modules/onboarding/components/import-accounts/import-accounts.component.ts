import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-import-accounts',
  templateUrl: './import-accounts.component.html',
})
export class ImportAccountsComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

  files: NgxFileDropEntry[] = [];
  filesPreview: NgxFileDropEntry[];

  dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    this.filesPreview = this.files.slice(0, 5);
  }
}
