import { Pipe, PipeTransform } from '@angular/core';
import { hexlify } from 'ethers/lib/utils';

@Pipe({
  name: 'hexlify'
})
export class HexlifyPipe implements PipeTransform {

  transform(value: Uint8Array, ...args: unknown[]): string {
    return value ? hexlify(value) : "";
  }

}
