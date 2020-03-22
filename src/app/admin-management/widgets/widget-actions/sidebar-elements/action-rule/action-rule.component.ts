import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// One - Services
import { ActionStateService } from '../../services/action-state.service';

@Component({
  selector: 'one-admin-action-rule',
  templateUrl: './action-rule.component.html',
  styleUrls: ['./action-rule.component.scss']
})
export class ActionRuleComponent implements OnInit {

  @Output() add: EventEmitter<any> = new EventEmitter<any>();
  @Output() edit: EventEmitter<any> = new EventEmitter<any>();

  stepInfo: any = {};

  constructor(
    public actionStateService: ActionStateService
  ) {
  }

  ngOnInit() {
  }

  removeRule(index) {
    this.actionStateService.action.dates.splice(index, 1);
  }

  editRule(item) {

  }

}
