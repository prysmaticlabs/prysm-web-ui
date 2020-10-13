import { AbstractControl, Validators } from '@angular/forms';

// PasswordValidator contains form validation for strong
// password protection in the Prysm web UI.
export class PasswordValidator {
  constructor() {}

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
      control.get('passwordConfirmation')?.setErrors({ passwordMismatch: true });
    }
  }
}
