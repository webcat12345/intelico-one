import { Pipe, PipeTransform } from '@angular/core';
import { AdminManagementService } from '../services/admin-management.service';

@Pipe({
  name: 'isMenuActive',
  pure: false
})
export class IsMenuActivePipe implements PipeTransform {

  constructor(
    private adminService: AdminManagementService
  ) {
  }

  transform(window_type: any, boxes?: any): any {
    const index = this.adminService.getWindowInfoByType(window_type, boxes);
    return index > -1 ? boxes[this.adminService.getWindowInfoByType(window_type, boxes)].active : false;
  }

}
