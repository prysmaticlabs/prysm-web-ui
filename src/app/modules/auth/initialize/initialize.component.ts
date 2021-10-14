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

  displayWarning = false;

  ngOnInit(): void {
    const accessToken = this.routeSnapshot.snapshot.queryParams['token'];
    const accessTokenExpiration = this.routeSnapshot.snapshot.queryParams['expiration'];
    // cache the token and token expiration for use
    if (accessToken ) {

      this.authenticationService.cacheToken(accessToken, accessTokenExpiration);
      // console.log('cached token');
    }

    // redirect users to dashboard if token is already cached
    if (this.authenticationService.getToken()){
      console.log('redirecting');
      this.displayWarning = false;
      this.router.navigate(['/dashboard']);
    } else {
      console.log('Warning: unauthorized');
      this.displayWarning = true;
    }

  }

}
