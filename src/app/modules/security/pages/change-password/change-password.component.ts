import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PasswordValidator } from 'src/app/modules/core/validators/password.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder
  ) { }
  formGroup: FormGroup;
  private passwordValidator = new PasswordValidator();

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator.strongPassword,
      ]),
      passwordConfirmation: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator.strongPassword,
      ]),
    }, {
      validators: this.passwordValidator.matchingPasswordConfirmation,
    });
  }

  resetPassword(): void {
    console.log(this.formGroup);
  }
}
