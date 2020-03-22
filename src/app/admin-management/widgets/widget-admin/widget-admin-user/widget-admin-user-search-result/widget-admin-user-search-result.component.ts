import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IUser } from '@one-core/service/user.service';

@Component({
  selector: 'one-admin-widget-admin-user-search-result',
  templateUrl: './widget-admin-user-search-result.component.html',
  styleUrls: ['./widget-admin-user-search-result.component.scss']
})
export class WidgetAdminUserSearchResultComponent implements OnInit {

  @Input() searchResult: IUser;
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onCreateNew() {
    this.close.emit({isNew: true, res: null});
  }

  onEditExistingUser() {
    this.close.emit({isNew: false, res: this.searchResult});
  }

}
