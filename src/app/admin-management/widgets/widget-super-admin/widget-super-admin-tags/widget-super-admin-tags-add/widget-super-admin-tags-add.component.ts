import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'one-admin-widget-super-admin-tags-add',
  templateUrl: './widget-super-admin-tags-add.component.html',
  styleUrls: ['./widget-super-admin-tags-add.component.scss']
})
export class WidgetSuperAdminTagsAddComponent implements OnInit {

  @Output() close: EventEmitter<boolean> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

}
