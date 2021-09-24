import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
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
    private routeSnapshot: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const accessToken = this.routeSnapshot.snapshot.queryParams['token'];
    if (accessToken) {
      this.authenticationService.loginWithToken(accessToken).pipe(tap(() => {
        if (this.authenticationService.getToken()){
          this.router.navigate(['/dashboard']);
        }
      })).subscribe();
    } else {
      if (this.authenticationService.getToken()){
        this.router.navigate(['/dashboard']);
      }
    }
  }

}
