import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'firstLetter'})
export class FirstLetterPipe implements PipeTransform {
  transform(array: any[], letter: string): any {
    array = array || [];
    const outArray = [];
    array.map( (item) => {
      if (item.lastName) {
        if (item.lastName.substring(0, 1).toLowerCase() === letter.toLowerCase()) {
          outArray.push(item);
        }
      }
      if (letter === '&') {
        outArray.push(item);
      }
    });
    return outArray;
  }
}
