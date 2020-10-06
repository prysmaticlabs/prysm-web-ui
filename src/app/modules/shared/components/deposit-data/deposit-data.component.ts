import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DepositDataResponse_DepositData } from 'src/app/proto/validator/accounts/v2/web_api';

@Component({
  selector: 'app-deposit-data',
  templateUrl: './deposit-data.component.html',
})
export class DepositDataComponent implements OnInit {
  @Input() depositData: DepositDataResponse_DepositData[] = [];
  depositDataFileName = '';
  constructor(
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.depositDataFileName = `deposit_data-${Date.now()}.json`;
  }

  generateDownloadJSONUri(data: DepositDataResponse_DepositData[]): SafeUrl {
    const json = JSON.stringify(data);
    return this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(json));
  }

  copy(data: DepositDataResponse_DepositData[]): void {
    this.clipboard.copy(JSON.stringify(data));
    this.snackBar.open('Copied JSON string to clipboard', 'Close', {
      duration: 4000,
    });
  }
}
