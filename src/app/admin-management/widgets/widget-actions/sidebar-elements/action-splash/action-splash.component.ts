import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { ActionStateService } from '../../services/action-state.service';
import { ToastrService } from '../../../../services/toastr.service';

@Component({
  selector: 'one-admin-action-splash',
  templateUrl: './action-splash.component.html',
  styleUrls: ['./action-splash.component.scss']
})
export class ActionSplashComponent implements OnInit {

  @Output() select: EventEmitter<any> = new EventEmitter<any>(); // now there is only one option
  stepInfo: any = {};
  isLoading = false;

  constructor(
    public actionStepService: ActionStateService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    if (this.actionStepService.isEditModal) {
      this.getActionById();
    }
  }

  async getActionById() {
    try {
      this.isLoading = true;
      await this.actionStepService.getActionById();
      this.select.emit();
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }
}
