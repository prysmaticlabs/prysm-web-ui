import { AbstractControl, Validators } from '@angular/forms';

export abstract class StaticPasswordValidator{
  static strongPassword = Validators.pattern(
    /(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}/
  );
  static matchingPasswordConfirmation(control: AbstractControl): void {
    const password: string = control.get('password')?.value;
    const confirmPassword: string = control.get('passwordConfirmation')?.value;
    if (password !== confirmPassword) {
      control
        .get('passwordConfirmation')
        ?.setErrors({ passwordMismatch: true });
    }
  }
}

// PasswordValidator contains form validation for strong
// password protection in the Prysm web UI.
export class PasswordValidator {
  constructor() {}

  errorMessage = {
    required: 'Password is required',
    minLength: 'Password must be at least 8 characters',
    pattern: 'Requires at least 1 letter, number, and special character',
    passwordMismatch: 'Passwords do not match',
  };

  // Ensures a password has at least:
  // 1 letter (?=.*[A-Za-z])
  // 1 number (?=.*\d)
  // 1 of any other character (?=.*[^A-Za-z\d])
  // with at least 8 total characters .{8,}
  strongPassword = Validators.pattern(
    /(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}/
  );

  // Ensure password and password confirmation field values match.
  matchingPasswordConfirmation(control: AbstractControl): void {
    const password: string = control.get('password')?.value;
    const confirmPassword: string = control.get('passwordConfirmation')?.value;
    if (password !== confirmPassword) {
      control
        .get('passwordConfirmation')
        ?.setErrors({ passwordMismatch: true });
    }
  }
}
