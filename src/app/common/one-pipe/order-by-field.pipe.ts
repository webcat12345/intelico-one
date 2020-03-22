import { Pipe, PipeTransform } from '@angular/core';

import { orderBy } from '../../core/utils/common.util';

@Pipe({name: 'orderByField'})
export class OrderByField implements PipeTransform {
  public transform(array: Array<any>, args?: any): any {
    return orderBy(array, args);
  }
}
