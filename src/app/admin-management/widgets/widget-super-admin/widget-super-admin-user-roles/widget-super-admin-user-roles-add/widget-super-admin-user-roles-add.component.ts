import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'one-admin-widget-super-admin-user-roles-add',
  templateUrl: './widget-super-admin-user-roles-add.component.html',
  styleUrls: ['./widget-super-admin-user-roles-add.component.scss']
})
export class WidgetSuperAdminUserRolesAddComponent implements OnInit {

  @Output() close: EventEmitter<boolean> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

}
