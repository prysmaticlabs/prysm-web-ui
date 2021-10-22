import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { LANDING_URL } from '../../core/constants';

@Component({
  selector: 'app-initialize',
  templateUrl: './initialize.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InitializeComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef
  ) {
    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = (): boolean => {
      return false;
    };

  }

  displayWarning = false;

  ngOnInit(): void {
    const accessToken = this.route.snapshot.queryParams['token'];
    const accessTokenExpiration = this.route.snapshot.queryParams['expiration'];
    // cache the token and token expiration for use
    if (accessToken ) {
      this.authenticationService.cacheToken(accessToken, accessTokenExpiration);
    }

    // redirect users to dashboard if token is already cached
    if (this.authenticationService.getToken()){
      console.log('redirecting');
      this.displayWarning = false;
      this.router.navigate([LANDING_URL]);
    } else {
      console.log('Warning: unauthorized');
      this.displayWarning = true;
    }

  }


}
