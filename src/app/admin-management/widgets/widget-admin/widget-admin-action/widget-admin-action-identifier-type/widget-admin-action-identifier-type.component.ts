import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { adminIdentifierWindowMeta } from '../../../../meta/admin-Identifier-window-meta';
import { IIdentifierType } from '../../widget-admin-identifier/widget-admin-identifier.interface';

@Component({
  selector: 'one-admin-widget-admin-action-identifier-type',
  templateUrl: './widget-admin-action-identifier-type.component.html',
  styleUrls: ['./widget-admin-action-identifier-type.component.scss']
})
export class WidgetAdminActionIdentifierTypeComponent implements OnInit {

  @Output() close: EventEmitter<boolean> = new EventEmitter();
  @Output() selectType: EventEmitter<IIdentifierType> = new EventEmitter();

  meta = adminIdentifierWindowMeta;

  constructor() {
  }

  ngOnInit() {
  }

}
