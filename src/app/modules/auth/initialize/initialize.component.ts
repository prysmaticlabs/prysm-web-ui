import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { take, tap, mergeMap } from 'rxjs/operators';
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
    private routeSnapshot: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let accessToken = this.routeSnapshot.snapshot.queryParams['token'];
    if (accessToken) {
      this.authenticationService.loginWithToken(accessToken).pipe(mergeMap(() => {
        //console.log(this.authenticationService.getToken())
        if(this.authenticationService.getToken()){
          this.router.navigate(['/dashboard']);
        } 
        return EMPTY;
      })).subscribe();
    } else {
      //console.log(this.authenticationService.getToken())
      if(this.authenticationService.getToken()){
        this.router.navigate(['/dashboard']);
      } 
    }
  }

  // private redirectUser$(): Observable<HasUsedWebResponse> {
  //   return this.authenticationService.checkHasUsedWeb().pipe(
  //     tap((res: HasUsedWebResponse) => {
  //       if (!res.hasWallet) {
  //         this.router.navigate(['/onboarding']);
  //       }
  //       else {
  //         this.router.navigate(['/dashboard']);
  //       }
  //     }),
  //     take(1),
  //   );
  // }
}
