import { AbstractControl, FormBuilder, FormControl } from '@angular/forms';

import { PasswordValidator } from './password.validator';

describe('PasswordValidator', () => {
  describe('Password strength checks', () => {
    it('should error if password does not contain uppercase characters', () => {
      const validator = new PasswordValidator();
      const validationFunc = validator.strongPassword;
      const formControl = {
        value: 'passwordpassword123$',
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
        value: 'Passwordpassword$',
      };
      const res = validationFunc(
        formControl as AbstractControl,
      );
      expect(res).not.toBeNull();
    });

    it('should error if password does not contain at least one special character', () => {
      const validator = new PasswordValidator();
      const validationFunc = validator.strongPassword;
      const formControl = {
        value: 'Passwordpassword2020',
      };
      const res = validationFunc(
        formControl as AbstractControl,
      );
      expect(res).not.toBeNull();
    });

    it('should error if password meets all requirements but is too short', () => {
      const validator = new PasswordValidator();
      const validationFunc = validator.strongPassword;
      const formControl = {
        value: '1Pass$',
      };
      const res = validationFunc(
        formControl as AbstractControl,
      );
      expect(res).not.toBeNull();
    });

    it('should not error if password meets all requirements', () => {
      const validator = new PasswordValidator();
      const validationFunc = validator.strongPassword;
      const formControl = {
        value: '%%STR0NGPASSWORDZ2020%%',
      };
      const res = validationFunc(
        formControl as AbstractControl,
      );
      expect(res).toBeNull();
    });
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
