import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../../core/services/wallet.service';
import { tap, takeUntil, filter } from 'rxjs/operators';
import * as FileSaver from 'file-saver';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { BaseComponent } from '../../../shared/components/base.component';
import '../../../shared/services/extensions';
@Component({
  selector: 'app-slashing-protection',
  templateUrl: './slashing-protection.component.html',
  styleUrls: ['./slashing-protection.component.scss'],
})
export class SlashingProtectionComponent
  extends BaseComponent
  implements OnInit {
  constructor(
    private walletService: WalletService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  isImport = false;

  ngOnInit(): void {
    this.router.events
      .pipe(
        takeUntil(this.destroyed$),
        filter((ev) => ev instanceof NavigationEnd),
        tap((ev) => {
          this.isImport = this.activatedRoute.snapshot.queryParams.import;
        })
      )
      .subscribe();
    this.isImport = this.activatedRoute.snapshot.queryParams.import;
  }

  // exportSlashingProtection(): void {
  //   this.walletService
  //     .exportSlashingProtection()
  //     .pipe(
  //       tap((response) => {
  //         const blob = new Blob([response.file], {
  //           type: 'text/plain;charset=utf-8',
  //         });
  //         const d = new Date();
  //         const fileName = `slashing-protection-${d.toDateTimeString()}.json`;
  //         FileSaver.saveAs(blob, fileName);
  //       })
  //     )
  //     .subscribe();
  // }

  toggleActive(previous: HTMLElement, current: HTMLElement): void {
    previous.classList.remove('active');
    current.classList.add('active');
  }
}
