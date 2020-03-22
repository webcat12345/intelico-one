import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IIdentifierType } from '../../widget-admin-identifier/widget-admin-identifier.interface';

@Component({
  selector: 'one-admin-widget-admin-action-type',
  templateUrl: './widget-admin-action-type.component.html',
  styleUrls: ['./widget-admin-action-type.component.scss']
})
export class WidgetAdminActionTypeComponent implements OnInit {

  @Input() selectedType: IIdentifierType;
  @Output() close: EventEmitter<boolean> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

}
