import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { NotificationStatus } from '@one-core/model';

@Component({
  selector: 'one-admin-people-sidebar',
  templateUrl: './widget-admin-people-sidebar.component.html',
  styleUrls: ['./widget-admin-people-sidebar.component.scss']
})
export class WidgetAdminPeopleSidebarComponent implements OnInit {

  @Output() changeFilter: EventEmitter<string> = new EventEmitter<string>();
  @Output() scrollToBottom: EventEmitter<string> = new EventEmitter<string>();

  NotificationStatus = NotificationStatus;

  typeOptions = [
    {value: 400, name: 'critical', label: 'Critical', additionalClass: 'critical'},
    {value: 300, name: 'high', label: 'High', additionalClass: 'high'},
    {value: 200, name: 'normal', label: 'Normal', additionalClass: 'normal'},
  ];

  selectedStatus = NotificationStatus.New;
  queries = ['', '', '', '', ''];

  constructor() {
  }

  ngOnInit() {
  }

  filterChanged(e, index?) {
    if (index) {
      this.queries[index] = e;
    }
    if (!index) {
      this.queries[e.index] = e.data;
    }
    // index 0 is for status filter default: new
    this.queries[0] = `status eq ${this.selectedStatus}`;
    this.changeFilter.emit(this.queries.filter(x => x).join(' and '));
  }

  statusFilterChange() {
    // this.filterChanged(`status eq ${this.selectedStatus}`, 0);
  }
}
