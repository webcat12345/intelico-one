import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'one-admin-widget-admin-user-invitation',
  templateUrl: './widget-admin-user-invitation.component.html',
  styleUrls: ['./widget-admin-user-invitation.component.scss']
})
export class WidgetAdminUserInvitationComponent implements OnInit {

  @Input() username: string;
  @Output() close: EventEmitter<boolean> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

}
