import { Injectable } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';

// PasswordValidator contains form validation for strong 
// password protection in the Prysm web UI.
@Injectable({
  providedIn: 'root'
})
export class PasswordValidator {
  constructor() {}

  // Ensures a password has at least 1 uppercase char, 1 special char,
  // and 1 number and must have at least length of 8.
  strongPassword = Validators.pattern(
    '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}',
  )

  // Ensure password and password confirmation field values match.
  matchingPasswordConfirmation(control: AbstractControl) {
    const password: string = control.get('password').value;
    const confirmPassword: string = control.get('passwordConfirmation').value;
    if (password !== confirmPassword) {
      control.get('passwordConfirmation').setErrors({ passwordMismatch: true });
    }
  }
}
