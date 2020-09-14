import { Pipe, PipeTransform } from '@angular/core';
import { base64ToHex } from '../../core/utils/hex-util';

@Pipe({
  name: 'base64tohex'
})
export class Base64ToHexPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    return value ? base64ToHex(value) : '';
  }
}
