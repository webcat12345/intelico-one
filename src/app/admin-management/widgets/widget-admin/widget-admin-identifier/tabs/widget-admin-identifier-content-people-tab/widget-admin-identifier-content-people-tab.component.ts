import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'one-admin-widget-admin-identifier-content-people-tab',
  templateUrl: './widget-admin-identifier-content-people-tab.component.html',
  styleUrls: ['./widget-admin-identifier-content-people-tab.component.scss']
})
export class WidgetAdminIdentifierContentPeopleTabComponent implements OnInit {

  @Output() addNewPeople: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

}
