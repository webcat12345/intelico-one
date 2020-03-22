import { Directive, HostListener } from '@angular/core';
import { environment } from '../../../environments/environment';

import { AdminManagementService } from '../services/admin-management.service';

@Directive({
  selector: '[oneAdminClickSound]'
})
export class ClickSoundDirective {

  constructor(
    private adminMangementService: AdminManagementService
  ) {
  }

  @HostListener('click') onClick() {
    this.playSound();
  }

  private playSound(): void {
    this.adminMangementService.playSound(environment.sounds.click);
  }
}
