import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from "@angular/router";

import { timer } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loading = false;
  constructor(
    private router: Router,
  ) { }

  onSubmit() {
    this.loading = true;
    timer(700).subscribe(
      () => {
        this.loading = false;
        this.router.navigate(['/dashboard/gains-and-losses']);
      },
    );
  }
}
