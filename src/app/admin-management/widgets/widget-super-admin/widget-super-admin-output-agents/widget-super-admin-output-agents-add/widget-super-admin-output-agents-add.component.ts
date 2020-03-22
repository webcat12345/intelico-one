import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'one-admin-widget-super-admin-output-agents-add',
  templateUrl: './widget-super-admin-output-agents-add.component.html',
  styleUrls: ['./widget-super-admin-output-agents-add.component.scss']
})
export class WidgetSuperAdminOutputAgentsAddComponent implements OnInit {

  @Output() close: EventEmitter<boolean> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

}
