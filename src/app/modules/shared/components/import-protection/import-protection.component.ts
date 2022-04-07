import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DropFile, DropFileAction, ImportDropzoneComponent } from 'src/app/modules/shared/components/import-dropzone/import-dropzone.component';
import { EIPSlashingProtectionFormat } from './model/interface';
import { FileStatus } from '../../services/enums';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-import-protection',
  templateUrl: './import-protection.component.html',
  styleUrls: ['./import-protection.component.scss'],
})
export class ImportProtectionComponent extends BaseComponent {

  @ViewChild('dropzone') dropzone: ImportDropzoneComponent | undefined;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    super();
  }

  fileStatus = FileStatus.default;
  fileStatuses = FileStatus;
  importedFiles: EIPSlashingProtectionFormat[] = [];
  importedFileNames: string[] = [];
  isImportingProtectionControl = this.formBuilder.control(null,Validators.required);

  fileChange(fileObj: DropFile): void {
    if(fileObj.action === DropFileAction.IMPORT){
      this.processFile(fileObj);
    } else if(fileObj.action === DropFileAction.DELETE){
      // remove file from importedFiles only
      this.importedFileNames = [];
      this.importedFiles = [];
    }
  }

  private processFile(fileObject: DropFile): void {
    const file = fileObject.file;
    if(file.size === 0){
      this.fileStatus = FileStatus.error;
      this.dropzone?.addInvalidFileReason(`Empty file: ${file?.name}`);
      return;
    }

    file.text().then((jsTxt) => {
      this.fileStatus = FileStatus.validating;
      if (!JSON.parse(jsTxt)) {
        this.fileStatus = FileStatus.error;
        this.dropzone?.addInvalidFileReason(`Invalid Format: ${file?.name}`);
        return;
      }
      const jObj: EIPSlashingProtectionFormat = JSON.parse(jsTxt);
      if (!jObj.metadata || !jObj.data || jObj.data.length === 0) {
        this.fileStatus = FileStatus.error;
        this.dropzone?.addInvalidFileReason(`Invalid Format: ${file?.name}`);
        return;
      }
      if (this.importedFileNames.includes(file?.name ?? '')) {
        this.dropzone?.addInvalidFileReason(`Duplicate File : ${file?.name}`);
        return;
      }
      
      this.importedFileNames.push(file?.name ?? '');
      this.importedFiles.push(jObj);
      this.fileStatus = FileStatus.validated;
      this.dropzone?.uploadedFiles.push(file);
    }).catch((err)=>{this.dropzone?.addInvalidFileReason(`Invalid Format: ${file?.name}`)});
    
  }

  toggleImportSlashingProtection(response:boolean): void {
    this.isImportingProtectionControl.setValue(response);
    this.dropzone?.reset();
    this.importedFileNames = [];
    this.importedFiles = [];
  }

  get invalid():boolean {
    return this.isImportingProtectionControl.invalid || this.isImportingProtectionControl.value && this.importedFiles.length === 0;
  }
}
