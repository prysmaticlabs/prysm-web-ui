import { TestBed } from '@angular/core/testing';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors } from '@angular/forms';
import { of, Observable, BehaviorSubject, throwError  } from 'rxjs';

import { WalletService } from '../../core/services/wallet.service';
import { KeystoreValidator } from './keystore.validator';
import { MAX_ALLOWED_KEYSTORES } from '../../core/constants';
import { ValidateKeystoresRequest } from '../../../proto/validator/accounts/v2/web_api';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

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
      for (let i = 0; i <= MAX_ALLOWED_KEYSTORES; i++) {
        keystores.push(['hi']);
      }
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
      walletService.validateKeystores = (req: ValidateKeystoresRequest): Observable<object> => {
        return throwError(new HttpErrorResponse({
          status: 400,
          error: { message: 'wrong password' },
        }));
      };
      const validationFunc = validator.correctPassword();
      const formBuilder = new FormBuilder();
      const formControl = formBuilder.group({
        keystoresImported: new FormControl([] as string[][], null),
        keystoresPassword: new FormControl('', null),
      });
      const obs = validationFunc(
        formControl as AbstractControl,
      ) as Observable<ValidationErrors>;
      obs.pipe(
        tap((errors) => {
          expect(errors).toEqual({
            incorrectPassword: 'wrong password',
          });
          done();
        }),
        catchError(err => {
          console.log(err);
          return throwError(err);
        }),
      ).subscribe();

      formControl.get('keystoresImported')?.setValue([['hi']]);
      formControl.get('keystoresPassword')?.setValue([['hi']]);
    });

    it('should show error for all other http error status codes received', done => {
      const validator = new KeystoreValidator(walletService);
      walletService.validateKeystores = (req: ValidateKeystoresRequest): Observable<object> => {
        return throwError(new HttpErrorResponse({
          status: 500,
          error: { message: 'oops' },
        }));
      };
      const validationFunc = validator.correctPassword();
      const formBuilder = new FormBuilder();
      const formControl = formBuilder.group({
        keystoresImported: new FormControl([] as string[][], null),
        keystoresPassword: new FormControl('', null),
      });
      const obs = validationFunc(
        formControl as AbstractControl,
      ) as Observable<ValidationErrors>;
      obs.pipe(
        tap((errors) => {
          expect(errors).toEqual({
            somethingWentWrong: true,
          });
          done();
        }),
        catchError(err => {
          console.log(err);
          return throwError(err);
        }),
      ).subscribe();

      formControl.get('keystoresImported')?.setValue([['hi']]);
      formControl.get('keystoresPassword')?.setValue([['hi']]);
    });

    it('should pass validation if no error is received from http response', done => {
      const validator = new KeystoreValidator(walletService);
      walletService.validateKeystores = (req: ValidateKeystoresRequest): Observable<object> => {
        return of({});
      };
      const validationFunc = validator.correctPassword();
      const formBuilder = new FormBuilder();
      const formControl = formBuilder.group({
        keystoresImported: new FormControl([] as string[][], null),
        keystoresPassword: new FormControl('', null),
      });
      const obs = validationFunc(
        formControl as AbstractControl,
      ) as Observable<ValidationErrors>;
      obs.pipe(
        tap((errors) => {
          expect(errors).toBeFalsy();
          done();
        }),
        catchError(err => {
          console.log(err);
          return throwError(err);
        }),
      ).subscribe();

      formControl.get('keystoresImported')?.setValue([['hi']]);
      formControl.get('keystoresPassword')?.setValue([['hi']]);
    });
  });
});
