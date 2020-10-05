import { TestBed } from '@angular/core/testing';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { of, Observable } from 'rxjs';

import { WalletService } from '../../core/services/wallet.service';
import { MnemonicValidator } from './mnemonic.validator';

describe('MnemonicValidator', () => {
  let walletService: WalletService;
  const spy = jasmine.createSpyObj('WalletService', ['generateMnemonic$']);

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
          { provide: WalletService, useValue: spy },
        ]
    });
    walletService = TestBed.inject(WalletService);
  });

  describe('Proper formatting', () => {
    it('should error if user input does not have the right word count', () => {
      const mnemonic = 'fish zebra someone';
      const validator = new MnemonicValidator(walletService);
      const validationFunc = validator.properFormatting;
      const formControl = {
        value: mnemonic,
      };
      expect(validationFunc(formControl as AbstractControl)).toBeTruthy();
    });

    it('proper word count, it should not error if there are extraneous spaces', () => {
      const mnemonic = ' grape harvest     method public garden knife power era kingdom immense kitchen ethics walk gap thing rude split lazy siren mind vital fork deposit zebra ';
      const validator = new MnemonicValidator(walletService);
      const validationFunc = validator.properFormatting;
      const formControl = {
        value: mnemonic,
      };
      expect(validationFunc(formControl as AbstractControl)).toBeNull();
    });
  });

  describe('Matching mnemonics', () => {
    it('should error if user input does not match value from service', done => {
      const validator = new MnemonicValidator(walletService);
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

    it('should not error if user input is empty', done => {
      const validator = new MnemonicValidator(walletService);
      walletService.generateMnemonic$ = of('hello foo');
      const validationFunc = validator.matchingMnemonic();
      const formControl = {
        value: '',
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

    it('should pass validation if user input matches value from service', done => {
      const validator = new MnemonicValidator(walletService);
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
});
