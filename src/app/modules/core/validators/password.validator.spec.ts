import { AbstractControl, FormBuilder, FormControl } from '@angular/forms';

import { PasswordValidator } from './password.validator';

describe('PasswordValidator', () => {
  describe('Password strength checks', () => {
    it('should error if password does not contain at least one letter', () => {
      const validator = new PasswordValidator();
      const validationFunc = validator.strongPassword;
      const formControl = {
        value: '1234567$',
      };
      const errors = validationFunc(
        formControl as AbstractControl,
      );
      expect(errors).not.toBeNull();
    });

    it('should error if password does not contain at least one number', () => {
      const validator = new PasswordValidator();
      const validationFunc = validator.strongPassword;
      const formControl = {
        value: '$Password',
      };
      const errors = validationFunc(
        formControl as AbstractControl,
      );
      expect(errors).not.toBeNull();
    });

    it('should error if password does not contain at least one special character', () => {
      const validator = new PasswordValidator();
      const validationFunc = validator.strongPassword;
      const formControl = {
        value: 'Password1',
      };
      const error = validationFunc(
        formControl as AbstractControl,
      );
      expect(error).not.toBeNull();
    });

    it('should error if password is too short', () => {
      const validator = new PasswordValidator();
      const validationFunc = validator.strongPassword;
      const formControl = {
        value: '1Pass$7',
      };
      const error = validationFunc(
        formControl as AbstractControl,
      );
      expect(error).not.toBeNull();
    });

    it('should not error if password meets all requirements', () => {
      const validator = new PasswordValidator();
      const validationFunc = validator.strongPassword;
      const formControl = {
        value: '%Strong2020%%',
      };
      const error = validationFunc(
        formControl as AbstractControl,
      );
      expect(error).toBeNull();
    });

    it('should not error if password meets all requirements, with punctuation for symbol', () => {
      const validator = new PasswordValidator();
      const validationFunc = validator.strongPassword;
      const formControl = {
        value: '%Strong2020%%',
      };
      const error = validationFunc(
        formControl as AbstractControl,
      );
      expect(error).toBeNull();
    });
  });

  it('should not error if password meets all requirements, with unicode for symbol', () => {
    const validator = new PasswordValidator();
    const validationFunc = validator.strongPassword;
    const formControl = {
      value: 'Strong2020🚀',
    };
    const error = validationFunc(
      formControl as AbstractControl,
    );
    expect(error).toBeNull();
  });

  it('should not error if password meets all requirements, with exactly minimum length', () => {
    const validator = new PasswordValidator();
    const validationFunc = validator.strongPassword;
    const formControl = {
      value: 'Pass123🚀',
    };
    const error = validationFunc(
      formControl as AbstractControl,
    );
    expect(error).toBeNull();
  });

  it('should not error if password meets all requirements, with only lowercase (no uppercase)', () => {
    const validator = new PasswordValidator();
    const validationFunc = validator.strongPassword;
    const formControl = {
      value: 'pass123🚀',
    };
    const error = validationFunc(
      formControl as AbstractControl,
    );
    expect(error).toBeNull();
  });

  it('should not error if password meets all requirements, with only uppercase (no lowercase)', () => {
    const validator = new PasswordValidator();
    const validationFunc = validator.strongPassword;
    const formControl = {
      value: 'PASS123🚀',
    };
    const error = validationFunc(
      formControl as AbstractControl,
    );
    expect(error).toBeNull();
  });

  describe('Password confirmation mismatches', () => {
    it('should error if password does not match confirmation', () => {
      const validator = new PasswordValidator();
      const formControl = new FormBuilder().group({
        password: new FormControl('Passw0rdz0202$', []),
        passwordConfirmation: new FormControl('Passw0rdz0202$$', []),
      });
      const validationFunc = validator.matchingPasswordConfirmation;
      validationFunc(
        formControl as AbstractControl,
      );
      expect(formControl?.get('passwordConfirmation')?.errors).not.toBeNull();
    });

    it('should not error if password matches confirmation', () => {
      const validator = new PasswordValidator();
      const password = 'Passw0rdz0202$';
      const formControl = new FormBuilder().group({
        password: new FormControl(password, []),
        passwordConfirmation: new FormControl(password, []),
      });
      const validationFunc = validator.matchingPasswordConfirmation;
      validationFunc(
        formControl as AbstractControl,
      );
      expect(formControl?.get('passwordConfirmation')?.errors).toBeNull();
    });
  });
});
