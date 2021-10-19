import { Component } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { ImportSlashingProtectionRequest } from 'src/app/proto/validator/accounts/v2/web_api';
import { WalletService } from '../../../core/services/wallet.service';
import { BaseComponent } from '../../../shared/components/base.component';
import { FileStatus } from '../../../shared/services/enums';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-import-protection',
  templateUrl: './import-protection.component.html',
  styleUrls: ['./import-protection.component.scss'],
})
export class ImportProtectionComponent extends BaseComponent {
  constructor(
    private walletService: WalletService,
    private notificationService: NotificationService
  ) {
    super();
  }

  fileStatus = FileStatus.default;
  fileStatuses = FileStatus;
  isUploading = false;
  importedFiles: any[] = [];
  importedKeys: string[] = [];

  file: File | undefined;
  fileChange(fileObj: {
    file: File;
    context: any;
    validationResult: (context: any, file: File, ...responses: any[]) => void;
  }): void {
    this.file = fileObj.file;
    this.file.text().then((txt) => {
      const validationResult = this.validateFile(txt);
      if (!validationResult.result) {
        fileObj.validationResult(fileObj.context, fileObj.file, [
          validationResult.response,
        ]);
      } else {
        fileObj.validationResult(fileObj.context, fileObj.file, []);
      }
    });
  }

  validateFile(jsTxt: string): { result: boolean; response: string } {
    this.fileStatus = FileStatus.validating;
    if (!JSON.parse(jsTxt)) {
      this.fileStatus = FileStatus.error;
      return { result: false, response: `Invalid Format: ${this.file?.name}` };
    }
    const jObj = JSON.parse(jsTxt);
    if (!jObj.metadata || !jObj.data || jObj.data.length === 0) {
      this.fileStatus = FileStatus.error;
      return { result: false, response: `Invalid Format: ${this.file?.name}` };
    }
    if (this.importedKeys.includes(this.file?.name ?? '')) {
      return { result: false, response: `Duplicate File : ${this.file?.name}` };
    }
    this.importedKeys.push(this.file?.name ?? '');
    this.importedFiles.push(jObj);
    this.fileStatus = FileStatus.validated;
    return { result: true, response: `` };
  }

  confirmImport(): void {
    this.isUploading = true;
    setTimeout(() => {
      this.fileStatus = FileStatus.uploading;
      const request = {
        slashingProtectionJSON: JSON.stringify(this.importedFiles),
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
              'An error occured while importing your slashing protection'
            );
            return error;
          })
        )
        .subscribe();
    }, 500);
  }
}
