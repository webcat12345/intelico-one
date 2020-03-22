import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'one-admin-widget-admin-identifier-content-companies-tab',
  templateUrl: './widget-admin-identifier-content-companies-tab.component.html',
  styleUrls: ['./widget-admin-identifier-content-companies-tab.component.scss']
})
export class WidgetAdminIdentifierContentCompaniesTabComponent implements OnInit {

  @Output() addNewCompany: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

}
