import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'one-admin-widget-admin-identifier-content-actions-tab',
  templateUrl: './widget-admin-identifier-content-actions-tab.component.html',
  styleUrls: ['./widget-admin-identifier-content-actions-tab.component.scss']
})
export class WidgetAdminIdentifierContentActionsTabComponent implements OnInit {

  @Output() addNewAction: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

}
