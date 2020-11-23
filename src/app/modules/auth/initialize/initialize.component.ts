import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { take, tap } from 'rxjs/operators';
import { HasUsedWeb } from 'src/app/proto/validator/accounts/v2/web_api';
import { AuthenticationService } from '../../core/services/authentication.service';

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
      tap((res: HasUsedWeb) => {
        if (res.hasSignedUp) {
          this.router.navigate(['/login']);
        }
        else {
          this.router.navigate(['/signup']);
        }
      }),
      take(1),
    ).subscribe();
  }
}
