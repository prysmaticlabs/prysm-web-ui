import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base.component';
import { WalletService } from '../../../core/services/wallet.service';
import { FileStatus } from '../../services/enums';
import { ImportSlashingProtectionRequest } from 'src/app/proto/validator/accounts/v2/web_api';
import { tap, catchError } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';
import { DropFile,DropFileAction, ImportDropzoneComponent} from 'src/app/modules/shared/components/import-dropzone/import-dropzone.component';
import { EIPSlashingProtectionFormat } from '../../../wallet/pages/slashing-protection/model/interface';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-import-protection',
  templateUrl: './import-protection.component.html',
  styleUrls: ['./import-protection.component.scss'],
})
export class ImportProtectionComponent extends BaseComponent implements OnInit {

  @ViewChild('dropzone') dropzone: ImportDropzoneComponent | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private walletService: WalletService,
    private notificationService: NotificationService
  ) {
    super();
  }

  fileStatus = FileStatus.default;
  fileStatuses = FileStatus;
  isUploading = false;
  importedFiles: EIPSlashingProtectionFormat[] = [];
  importedFileNames: string[] = [];
  isImportingProtectionControl = this.formBuilder.control(null,Validators.required);

  ngOnInit(): void {}
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

  confirmImport(): void {
    this.isUploading = true;
    setTimeout(() => {
      this.fileStatus = FileStatus.uploading;
      const request = {
        slashingProtectionJson: JSON.stringify(this.importedFiles),
      } as ImportSlashingProtectionRequest;

      this.walletService
        .importSlashingProtection(request)
        .pipe(
          tap(() => {
            this.isUploading = false;
            this.notificationService.notifySuccess(
              'Successfully imported your slashing protection'
            );
            this.back();
          }),
          catchError((error) => {
            this.isUploading = false;
            this.notificationService.notifyError(
              'An error occurred while importing your slashing protection'
            );
            return error;
          })
        )
        .subscribe();
    }, 500);
  }
}
