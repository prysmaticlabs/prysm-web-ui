import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../shared/components/base.component';
import { WalletService } from '../../../core/services/wallet.service';
import { FileStatus } from '../../../shared/services/enums';
import { ImportSlashingProtectionRequest } from 'src/app/proto/validator/accounts/v2/web_api';
import { tap, catchError } from 'rxjs/operators';
import { NotificationService } from '../../../shared/services/notification.service';

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
  fileObjStr = '';
  ngOnInit(): void {}
  fileChange(fileObj: { file: File; txt: string }): void {
    this.fileObjStr = fileObj.txt;
  }

  validateFile(jsTxt: string): boolean {
    this.fileStatus = FileStatus.validating;
    if (!JSON.parse(jsTxt)) {
      this.fileStatus = FileStatus.error;
      return false;
    }
    const jObj = JSON.parse(jsTxt);
    if (!jObj.metadata || !jObj.data || jObj.data.length === 0) {
      this.fileStatus = FileStatus.error;
      return false;
    }
    return true;
  }

  confirmImport(): void {
    this.isUploading = true;
    setTimeout(() => {
      if (!this.validateFile(this.fileObjStr)) {
        this.isUploading = false;
        return;
      }
      this.fileStatus = FileStatus.uploading;
      const request = {
        slashingProtectionJSON: this.fileObjStr,
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
              'Error happened while import your slashing protection'
            );
            return error;
          })
        )
        .subscribe();
    }, 500);
  }
}
