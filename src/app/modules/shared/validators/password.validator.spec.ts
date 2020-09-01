import { AbstractControl } from '@angular/forms';

import { PasswordValidator } from './password.validator';

describe('PasswordValidator', () => {
  it('should error if password is does not contain uppercase characters', () => {
    let validator = new PasswordValidator();
    const validationFunc = validator.strongPassword
    const formControl = {
      value: 'passwordpassword123$',
    };
    const errors = validationFunc(
      formControl as AbstractControl,
    );
    expect(errors).not.toBeNull();
  });

  it('should error if password is does not contain at least one number', () => {
    let validator = new PasswordValidator();
    const validationFunc = validator.strongPassword
    const formControl = {
      value: 'Passwordpassword$',
    };
    const res = validationFunc(
      formControl as AbstractControl,
    );
    expect(res).not.toBeNull();
  });

  it('should error if password is does not contain at least one special character', () => {
    let validator = new PasswordValidator();
    const validationFunc = validator.strongPassword
    const formControl = {
      value: 'Passwordpassword2020',
    };
    const res = validationFunc(
      formControl as AbstractControl,
    );
    expect(res).not.toBeNull();
  });

  it('should error if password meets all requirements but is too short', () => {
    let validator = new PasswordValidator();
    const validationFunc = validator.strongPassword
    const formControl = {
      value: '1Pass$',
    };
    const res = validationFunc(
      formControl as AbstractControl,
    );
    expect(res).not.toBeNull();
  });

  it('should not error if password meets all requirements', () => {
    let validator = new PasswordValidator();
    const validationFunc = validator.strongPassword
    const formControl = {
      value: '%%Str0ngpAsswordz2020%%',
    };
    const res = validationFunc(
      formControl as AbstractControl,
    );
    expect(res).toBeNull();
  });
});