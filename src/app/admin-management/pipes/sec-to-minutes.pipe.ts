import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secToMinutes'
})
export class SecToMinutesPipe implements PipeTransform {

  transform(sec: number, args?: any): any {
    return Math.floor(sec / 60);
  }

}
