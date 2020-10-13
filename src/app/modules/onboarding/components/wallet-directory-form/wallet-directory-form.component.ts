import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { throwError } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { DefaultWalletResponse } from 'src/app/proto/validator/accounts/v2/web_api';

@Component({
  selector: 'app-wallet-directory-form',
  templateUrl: './wallet-directory-form.component.html',
})
export class WalletDirectoryFormComponent implements OnInit {
  @Input() formGroup: FormGroup | null = null;
  constructor(
    private walletService: WalletService,
  ) { }
  loading = false;
  defaultWalletDir = '';

  ngOnInit(): void {
    this.walletService.defaultWalletDir$.pipe(
      take(1),
      tap((res: DefaultWalletResponse) => {
        this.loading = false;
        this.defaultWalletDir = res.walletDir;
        this.formGroup?.controls.walletDir.setValue(this.defaultWalletDir);
      }),
      catchError(err => {
        this.loading = false;
        return throwError(err);
      })
    ).subscribe();
  }
}
