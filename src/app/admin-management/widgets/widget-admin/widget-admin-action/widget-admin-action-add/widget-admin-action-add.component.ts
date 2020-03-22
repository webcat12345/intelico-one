import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IIdentifierType } from '../../widget-admin-identifier/widget-admin-identifier.interface';

@Component({
  selector: 'one-admin-widget-admin-action-add',
  templateUrl: './widget-admin-action-add.component.html',
  styleUrls: ['./widget-admin-action-add.component.scss']
})
export class WidgetAdminActionAddComponent implements OnInit {

  @Input() selectedType: IIdentifierType;
  @Output() close: EventEmitter<boolean> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

}
