import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IIdentifierType } from '../../widget-admin-identifier/widget-admin-identifier.interface';

@Component({
  selector: 'one-admin-widget-admin-action-search',
  templateUrl: './widget-admin-action-search.component.html',
  styleUrls: ['./widget-admin-action-search.component.scss']
})
export class WidgetAdminActionSearchComponent implements OnInit {

  @Input() selectedType: IIdentifierType;
  @Output() close: EventEmitter<boolean> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

}
