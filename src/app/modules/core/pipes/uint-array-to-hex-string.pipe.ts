import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uintArrayToHexString'
})
export class UintArrayToHexStringPipe implements PipeTransform {

  transform(value: Uint8Array, ...args: unknown[]): string {
    return [...new Uint8Array(value)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
  }

}
