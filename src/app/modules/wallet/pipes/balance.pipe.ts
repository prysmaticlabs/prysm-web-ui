import { Pipe, PipeTransform } from '@angular/core';

/*
 * Formats a validator balance, showing n/a if 0.
*/
@Pipe({name: 'balance'})
export class BalancePipe implements PipeTransform {
  transform(n: string): string {
    if (n === '0') {
      return 'n/a';
    }
    return n;
  }
}
