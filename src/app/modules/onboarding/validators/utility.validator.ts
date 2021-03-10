import { ValidationErrors, AbstractControl, FormGroup } from '@angular/forms';
export abstract class UtilityValidator {
  static BiggerThanZero(ctrl: AbstractControl): ValidationErrors | null {
    if (!ctrl.value || !+ctrl.value) {
      return { BiggerThanZero: true };
    }
    const val = +ctrl.value;
    if (val > 0) {
      return null;
    }
    return { BiggerThanZero: true };
  }

  static MustBe(value: any): ValidationErrors | null {
    return (ctrl: AbstractControl) => {
      if (ctrl.value === value) {
        return null;
      }
      return {
        incorectValue: true,
      };
    };
  }

  static MustHaveMoreThanOneControle(grp: FormGroup): ValidationErrors | null {
    if (Object.keys(grp.controls).length > 1) {
      return null;
    }
    return {
      mustSelectOne: true,
    };
  }
}
