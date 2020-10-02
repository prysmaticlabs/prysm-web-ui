import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { WalletService } from 'src/app/modules/core/services/wallet.service';
import { WalletResponse } from 'src/app/proto/validator/accounts/v2/web_api';

@Component({
  selector: 'app-wallet-details',
  templateUrl: './wallet-details.component.html',
})
export class WalletDetailsComponent implements OnInit, OnDestroy {
  constructor(
    private walletService: WalletService,
  ) { }
  private destroyed$ = new Subject<void>();
  loading = false;
  wallet: WalletResponse | null = null;
  keymanagerKind = 'UNKNOWN';

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private fetchData(): void {
    this.loading = true;
    this.walletService.walletConfig$.pipe(
      takeUntil(this.destroyed$),
      tap((res: WalletResponse) => {
        this.loading = false;
        this.wallet = res;
        if (!this.wallet.keymanagerKind) {
          this.keymanagerKind = 'DERIVED';
        } else {
          this.keymanagerKind = this.wallet.keymanagerKind;
        }
        console.log(res);
      }),
      catchError((err) => {
        this.loading = false;
        return throwError(err);
      }),
    ).subscribe();
  }
}
