import { TestBed } from '@angular/core/testing';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors } from '@angular/forms';
import { of, Observable, BehaviorSubject, throwError  } from 'rxjs';

import { WalletService } from '../../core/services/wallet.service';
import { KeystoreValidator } from './keystore.validator';
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
        keystore: new FormControl({ value: ''}),
        keystoresPassword: new FormControl('asdsadasd', null),
      });
      const obs = validationFunc(
        formControl as AbstractControl,
      ) as Observable<ValidationErrors>;
      obs.pipe(
        tap((errors) => {
          expect(errors).toEqual({
            incorrectPassword: 'wrong password',
          });
          
        }),
        catchError(err => {
          console.log(err);
          return throwError(err);
        }),
      ).subscribe();
      done();
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
        keystore: new FormControl({ value: ''}),
        keystoresPassword: new FormControl('asdsadasd', null),
      });
      const obs = validationFunc(
        formControl as AbstractControl,
      ) as Observable<ValidationErrors>;
      obs.pipe(
        tap((errors) => {
          expect(errors).toEqual({
            somethingWentWrong: true,
          });
          
        }),
        catchError(err => {
          console.log(err);
          return throwError(err);
        }),
      ).subscribe();
      done();
    });

    it('should pass validation if no error is received from http response', done => {
      const validator = new KeystoreValidator(walletService);
      walletService.validateKeystores = (req: ValidateKeystoresRequest): Observable<object> => {
        return of({});
      };
      const validationFunc = validator.correctPassword();
      const formBuilder = new FormBuilder();
      const formControl = formBuilder.group({
        keystore: new FormControl({ value: ''}),
        keystoresPassword: new FormControl('asdsadasd', null),
      });
      const obs = validationFunc(
        formControl as AbstractControl,
      ) as Observable<ValidationErrors>;
      obs.pipe(
        tap((errors) => {
          expect(errors).toBeFalsy();
         
        }),
        catchError(err => {
          console.log(err);
          return throwError(err);
        }),
      ).subscribe();
      done();
    });
  });
});
