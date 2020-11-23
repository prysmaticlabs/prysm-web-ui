import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../modules/shared/shared.module';
import { LoginComponent } from './login/login.component';
import { InitializeComponent } from './initialize/initialize.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [LoginComponent, InitializeComponent, SignupComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
  ]
})
export class AuthModule { }
