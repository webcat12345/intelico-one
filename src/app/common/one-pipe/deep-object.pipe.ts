import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deepObjectFilter'
})
export class DeepObjectPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let obj = null;
    if (args.length > 1) {
      obj = JSON.parse(JSON.stringify(value));
      // tslint:disable-next-line
      for (let i = 0; i < args.length; i++) {
        obj = obj[args[i]];
      }
    } else {
      obj = null;
    }
    return obj;
  }

}
