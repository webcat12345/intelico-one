import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { adminIdentifierWindowMeta } from '../../../../meta/admin-Identifier-window-meta';
import { IIdentifierType } from '../widget-admin-identifier.interface';
import { IType } from '@one-core/service/types.service';

@Component({
  selector: 'one-admin-widget-admin-identifier-add',
  templateUrl: './widget-admin-identifier-add.component.html',
  styleUrls: ['./widget-admin-identifier-add.component.scss']
})
export class WidgetAdminIdentifierAddComponent implements OnInit {

  @Input() types: IType[];
  @Output() close: EventEmitter<boolean> = new EventEmitter();
  @Output() selectType: EventEmitter<IIdentifierType> = new EventEmitter();

  meta = adminIdentifierWindowMeta;

  constructor() {
  }

  ngOnInit() {
  }

}
