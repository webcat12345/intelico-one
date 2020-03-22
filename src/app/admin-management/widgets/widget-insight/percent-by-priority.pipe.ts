import { Pipe, PipeTransform } from '@angular/core';
import { Priority, TotalAlertByPriority } from '@one-core/model';

@Pipe({
  name: 'percentByPriority'
})
export class PercentByPriorityPipe implements PipeTransform {

  transform(value: TotalAlertByPriority, args?: Priority): any {
    const totalValue = value.normal + value.critical + value.high;
    if (args === Priority.Normal) {
      if (value.normal) {
        return value.normal / totalValue * 100;
      }
      if (!value.normal) {
        return 0;
      }
    } else if (args === Priority.High) {
      if (value.high) {
        return value.high / totalValue * 100;
      }
      if (!value.high) {
        return 0;
      }
    } else if (args === Priority.Critical) {
      if (value.critical) {
        return value.critical / totalValue * 100;
      }
      if (!value.critical) {
        return 0;
      }
    } else {
      return 0;
    }
  }

}
