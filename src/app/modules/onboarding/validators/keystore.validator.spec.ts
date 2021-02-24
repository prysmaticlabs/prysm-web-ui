import { TestBed } from '@angular/core/testing';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { of, Observable } from 'rxjs';

import { WalletService } from '../../core/services/wallet.service';
import { KeystoreValidator } from './keystore.validator';

describe('KeystoreValidator', () => {
  let walletService: WalletService;
  const spy = jasmine.createSpyObj('WalletService', ['validateKeystores']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: WalletService, useValue: spy },
      ]
    });
    walletService = TestBed.inject(WalletService);
  });

  describe('Validate integrity', () => {
    it('should error if user keystores in input are empty', () => {
      const keystores: string[][] = [];
      const validator = new KeystoreValidator(walletService);
      const validationFunc = validator.validateIntegrity;
      const formControl = {
        value: keystores,
      };
      expect(validationFunc(formControl as AbstractControl)).toBeTruthy();
    });

    it('should error if number of keystores is above max allowed', () => {
      const keystores: string[][] = [];
      const validator = new KeystoreValidator(walletService);
      const validationFunc = validator.validateIntegrity;
      const formControl = {
        value: keystores,
      };
      expect(validationFunc(formControl as AbstractControl)).toBeTruthy();
    });
  });

  describe('Correct password', () => {
    it('should incorrect password error if error 400 is received from http response', done => {
      const validator = new KeystoreValidator(walletService);
      walletService.generateMnemonic$ = of('hello foo');
      const validationFunc = validator.correctPassword();
      const formControl = {
        value: 'hello bar',
        valueChanges: of({}),
      };
      const obs = validationFunc(
        formControl as AbstractControl,
      ) as Observable<ValidationErrors>;
      obs.subscribe((errors) => {
        expect(errors).toBeTruthy();
        done();
      });
    });

    it('should show error for all other http error status codes received', done => {
      const validator = new KeystoreValidator(walletService);
      walletService.generateMnemonic$ = of('hello foo');
      const validationFunc = validator.correctPassword();
      const formControl = {
        value: 'hello bar',
        valueChanges: of({}),
      };
      const obs = validationFunc(
        formControl as AbstractControl,
      ) as Observable<ValidationErrors>;
      obs.subscribe((errors) => {
        expect(errors).toBeTruthy();
        done();
      });
    });

    it('should pass validation if no error is received from http response', done => {
    });
  });
});
