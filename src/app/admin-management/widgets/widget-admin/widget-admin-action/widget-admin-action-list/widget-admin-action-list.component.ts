import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IIdentifierType } from '../../widget-admin-identifier/widget-admin-identifier.interface';

@Component({
  selector: 'one-admin-widget-admin-action-list',
  templateUrl: './widget-admin-action-list.component.html',
  styleUrls: ['./widget-admin-action-list.component.scss']
})
export class WidgetAdminActionListComponent implements OnInit {

  @Input() selectedType: IIdentifierType;
  @Output() close: EventEmitter<boolean> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

}
