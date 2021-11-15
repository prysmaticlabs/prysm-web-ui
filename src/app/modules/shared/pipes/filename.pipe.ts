import { Pipe, PipeTransform } from '@angular/core';

/*
 * Formats a validator balance, showing n/a if 0.
*/
@Pipe({name: 'filename'})
export class FileNamePipe implements PipeTransform {
  transform(name: string, maxLength: number): string {
    const ext: string =
      name.substring(name.lastIndexOf('.') + 1, name.length).toLowerCase();
    let newName: string = name.replace('.' + ext, '');
    if (name.length <= maxLength || maxLength < 8) {
      // if file name length is less than maxLength do not format
      // return same name
      return name;
    } else {
        // if file name length is greater than maxLength
        const fileName = name.substring(0, name.lastIndexOf('.'));
        const firstHalf = fileName.substring(0, Math.floor(fileName.length / 2));
        const secondHalf = fileName.substring(Math.floor(fileName.length / 2), fileName.length);

        const fileNamePartMaxLength = Math.floor((maxLength - ext.length - 3)/2);
       
        const newName = firstHalf.substring(0,fileNamePartMaxLength) + '...' + secondHalf.substring(secondHalf.length-fileNamePartMaxLength,secondHalf.length);
        
        return newName + '.' + ext;
    }
  }
}
