import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { take, tap } from 'rxjs/operators';
import { HasUsedWebResponse } from 'src/app/proto/validator/accounts/v2/web_api';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-initialize',
  templateUrl: './initialize.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InitializeComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authenticationService.checkHasUsedWeb().pipe(
      tap((res: HasUsedWebResponse) => {
        if (!res.hasWallet) {
          this.router.navigate(['/onboarding']);
        }
        else {
          this.router.navigate(['/dashboard/gains-and-losses']);
        }
      }),
      take(1),
    ).subscribe();
  }
}
