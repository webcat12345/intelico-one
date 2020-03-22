import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminManagementService } from '../../services/admin-management.service';

@Component({
  selector: 'one-admin-admin-idle-modal',
  templateUrl: './admin-idle-modal.component.html',
  styleUrls: ['./admin-idle-modal.component.scss']
})
export class AdminIdleModalComponent implements OnInit {

  @Input() idleCountDown: number;
  @Input() bImage: string;
  @Output() resetIdleMode: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private adminService: AdminManagementService
  ) {
  }

  ngOnInit() {
  }

  restore() {
    this.adminService.resetIdleChecker();
  }

}
