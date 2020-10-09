import { Pipe, PipeTransform } from '@angular/core';
import { FAR_FUTURE_EPOCH } from 'src/app/modules/core/constants';

/*
 * Formats an epoch, such as 0 to 'genesis' and FAR_FUTURE_EPOCH to 'n/a'
*/
@Pipe({name: 'epoch'})
export class EpochPipe implements PipeTransform {
  transform(n: number): string {
    if (!n) {
      return 'n/a';
    }
    if (n === 0) {
      return 'genesis';
    } else if (n.toString() === FAR_FUTURE_EPOCH) {
      return 'n/a';
    }
    return n.toString();
  }
}
