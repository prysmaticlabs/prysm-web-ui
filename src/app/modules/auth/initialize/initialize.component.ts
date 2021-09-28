import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    const accessTokenExpiration = this.routeSnapshot.snapshot.queryParams['tokenExpiration'];
    // cache the token and token expiration for use
    if (accessToken && accessTokenExpiration) {
      this.authenticationService.cacheToken(accessToken, accessTokenExpiration);
    }
    // redirect users to dashboard if token is already cached
    if (this.authenticationService.getToken()){
      this.router.navigate(['/dashboard']);
    }
  }

}
