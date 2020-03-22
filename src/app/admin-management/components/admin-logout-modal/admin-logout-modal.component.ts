import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'one-admin-admin-logout-modal',
  templateUrl: './admin-logout-modal.component.html',
  styleUrls: ['./admin-logout-modal.component.scss']
})
export class AdminLogoutModalComponent implements OnInit {

  @Output() cancelLogout: EventEmitter<any> = new EventEmitter();
  @Output() doLogout: EventEmitter<any> = new EventEmitter();
  @Output() doSelectOrg: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

}
