import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  submitted: boolean;
  loginForm: FormGroup;
  returnUrl: string;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar,
  ) {
    this.loginForm = this.formBuilder.group({
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}',
        )
      ]),
    });
  }

  ngOnInit() {
    // Redirect to dashboard by default unless a different
    // return url is set in the query parameters.
    this.route.queryParams
      .subscribe(params => this.returnUrl = params.return || '/dashboard/gains-and-losses');
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.controls.password.errors) {
      console.error(this.loginForm.controls.password.errors);
      return;
    }
    const password = this.loginForm.get('password').value as string;
    this.loading = true;
    this.authService.login(password).subscribe(
      () => {
        this.loading = false;
        this.router.navigateByUrl(this.returnUrl);
      },
      (err) => {
        this.loading = false;
        this.snackBar.open(err, 'Close', {
          duration: 2000,
        });
        console.error(err);
      }
    );
  }
}
