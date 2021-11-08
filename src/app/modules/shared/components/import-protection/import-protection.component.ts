import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { WalletService } from '../../../core/services/wallet.service';
import { FileStatus } from '../../services/enums';
import { ImportSlashingProtectionRequest } from 'src/app/proto/validator/accounts/v2/web_api';
import { tap, catchError } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';
import { DropFile,DropFileAction} from 'src/app/modules/shared/components/import-dropzone/import-dropzone.component';
import { EIPSlashingProtectionFormat } from '../../../wallet/pages/slashing-protection/model/interface';

@Component({
  selector: 'app-import-protection',
  templateUrl: './import-protection.component.html',
  styleUrls: ['./import-protection.component.scss'],
})
export class ImportProtectionComponent extends BaseComponent implements OnInit {
  constructor(
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

  file: File | undefined;
  ngOnInit(): void {}
  fileChange(fileObj: DropFile): void {
    if(fileObj.action === DropFileAction.IMPORT){
      console.log(fileObj)
      const validationResult = this.validateFile(fileObj);
      fileObj.context.pushValidationResult({file:fileObj.file,responses:validationResult});
    } else if(fileObj.action === DropFileAction.DELETE){
      // remove file from importedFiles only
      this.importedFileNames = [];
      this.importedFiles = [];
    }
  }

  private validateFile(fileObject: DropFile): string[] {
    const file = fileObject.file;
    if(file.size === 0){
      this.fileStatus = FileStatus.error;
      return [`Empty file: ${file?.name}`];
    }

    file.text().then((jsTxt) => {
      this.fileStatus = FileStatus.validating;
      if (!JSON.parse(jsTxt)) {
        this.fileStatus = FileStatus.error;
        return [`Invalid Format: ${file?.name}`] ;
      }
      const jObj: EIPSlashingProtectionFormat = JSON.parse(jsTxt);
      if (!jObj.metadata || !jObj.data || jObj.data.length === 0) {
        this.fileStatus = FileStatus.error;
        return [`Invalid Format: ${file?.name}`] ;
      }
      if (this.importedFileNames.includes(file?.name ?? '')) {
        return [`Duplicate File : ${file?.name}`];
      }
      
      this.importedFileNames.push(file?.name ?? '');
      this.importedFiles.push(jObj);
      this.fileStatus = FileStatus.validated;
    });
    return [];
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
