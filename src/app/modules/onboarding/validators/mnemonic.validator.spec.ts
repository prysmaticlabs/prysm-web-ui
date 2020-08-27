import { TestBed } from '@angular/core/testing';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { of, Observable } from 'rxjs';

import { WalletService } from '../../core/services/wallet.service';
import { MnemonicValidator } from './mnemonic.validator';

describe('MnemonicValidator', () => {
  let walletService: jasmine.SpyObj<WalletService>;
  const spy = jasmine.createSpyObj('WalletService', ['generateMnemonic$']);

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
          { provide: WalletService, useValue: spy },
        ]
    });
    walletService = TestBed.get(WalletService);
  });

  it('should error if user input does not match value from service', done => {
    let validator = new MnemonicValidator(walletService);
    walletService.generateMnemonic$ = of('hello foo');
    const validationFunc = validator.matchingMnemonic();
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

  it('should pass validation if user input matches value from service', done => {
    let validator = new MnemonicValidator(walletService);
    walletService.generateMnemonic$ = of('hello foo');
    const validationFunc = validator.matchingMnemonic();
    const formControl = {
      value: 'hello foo',
      valueChanges: of({}),
    };
    const obs = validationFunc(
      formControl as AbstractControl,
    ) as Observable<ValidationErrors>;
    obs.subscribe((errors) => {
      expect(errors).toBeFalsy();
      done();
    });
  });
});