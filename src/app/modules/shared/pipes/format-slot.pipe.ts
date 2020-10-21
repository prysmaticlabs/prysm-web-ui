import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a slot, such that negative values are interpreted to 'awaiting genesis,'
 * and 0 to 'genesis'
 */
@Pipe({name: 'slot'})
export class SlotPipe implements PipeTransform {
  transform(n: number): string {
    if (!n && n !== 0) {
      return 'n/a';
    }
    if (n <  0) {
      return 'awaiting genesis';
    }
    return n.toString();
  }
}
