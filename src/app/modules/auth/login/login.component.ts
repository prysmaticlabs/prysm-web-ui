import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject, throwError } from 'rxjs';
import { takeUntil, tap, catchError } from 'rxjs/operators';

import { AuthenticationService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  submitted: boolean;
  loginForm: FormGroup;
  returnUrl: string;
  loading = false;
  destroyed$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
  ) {
    this.loginForm = this.formBuilder.group({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}',
        )
      ]),
    });
  }

  ngOnInit(): void {
    // Redirect to dashboard by default unless a different
    // return url is set in the query parameters.
    this.route.queryParams.pipe(
      takeUntil(this.destroyed$),
    ).subscribe(params => this.returnUrl = params.return || '/onboarding');
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.controls.password.errors) {
      return;
    }
    const password = this.loginForm.get('password').value as string;
    this.loading = true;
    this.authService.login(password).pipe(
      tap((res) => {
        this.loading = false;
        this.router.navigateByUrl(this.returnUrl);
      }),
      takeUntil(this.destroyed$),
      catchError(err => {
        this.loading = false;
        return throwError(err);
      })
    ).subscribe();
  }
}
